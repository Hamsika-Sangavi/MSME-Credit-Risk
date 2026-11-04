import hashlib
import hmac
import secrets
import sqlite3
from pathlib import Path

from fastapi import HTTPException, Request, Response, status


DATABASE_PATH = Path(__file__).with_name("auth.db")
SESSION_COOKIE = "msme_session"
SESSION_MAX_AGE = 60 * 60 * 24


def _connection():
    connection = sqlite3.connect(DATABASE_PATH)
    connection.row_factory = sqlite3.Row
    return connection


def initialize_auth():
    with _connection() as connection:
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT NOT NULL UNIQUE,
                password_hash TEXT NOT NULL,
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            )
            """
        )
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS sessions (
                token_hash TEXT PRIMARY KEY,
                user_id INTEGER NOT NULL,
                expires_at INTEGER NOT NULL,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
            """
        )


def _hash_password(password: str, salt: bytes | None = None):
    salt = salt or secrets.token_bytes(16)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode(), salt, 310_000)
    return f"{salt.hex()}${digest.hex()}"


def _verify_password(password: str, encoded_hash: str):
    salt_hex, digest_hex = encoded_hash.split("$", 1)
    expected = hashlib.pbkdf2_hmac(
        "sha256", password.encode(), bytes.fromhex(salt_hex), 310_000
    )
    return hmac.compare_digest(expected.hex(), digest_hex)


def _token_hash(token: str):
    return hashlib.sha256(token.encode()).hexdigest()


def create_user(email: str, password: str):
    normalized_email = email.strip().lower()
    with _connection() as connection:
        try:
            cursor = connection.execute(
                "INSERT INTO users (email, password_hash) VALUES (?, ?)",
                (normalized_email, _hash_password(password)),
            )
        except sqlite3.IntegrityError as exc:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="An account with this email already exists.",
            ) from exc
        return {"id": cursor.lastrowid, "email": normalized_email}


def authenticate_user(email: str, password: str):
    with _connection() as connection:
        user = connection.execute(
            "SELECT id, email, password_hash FROM users WHERE email = ?",
            (email.strip().lower(),),
        ).fetchone()
    if not user or not _verify_password(password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password.",
        )
    return {"id": user["id"], "email": user["email"]}


def start_session(user_id: int, response: Response):
    token = secrets.token_urlsafe(32)
    with _connection() as connection:
        connection.execute(
            "INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?, ?, strftime('%s', 'now') + ?)",
            (_token_hash(token), user_id, SESSION_MAX_AGE),
        )
    response.set_cookie(
        SESSION_COOKIE,
        token,
        max_age=SESSION_MAX_AGE,
        httponly=True,
        samesite="lax",
        secure=False,
    )


def get_current_user(request: Request):
    token = request.cookies.get(SESSION_COOKIE)
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required.",
        )
    with _connection() as connection:
        user = connection.execute(
            """
            SELECT users.id, users.email
            FROM sessions
            JOIN users ON users.id = sessions.user_id
            WHERE sessions.token_hash = ? AND sessions.expires_at > strftime('%s', 'now')
            """,
            (_token_hash(token),),
        ).fetchone()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session expired. Please sign in again.",
        )
    return dict(user)


def end_session(request: Request, response: Response):
    token = request.cookies.get(SESSION_COOKIE)
    if token:
        with _connection() as connection:
            connection.execute(
                "DELETE FROM sessions WHERE token_hash = ?", (_token_hash(token),)
            )
    response.delete_cookie(SESSION_COOKIE)
