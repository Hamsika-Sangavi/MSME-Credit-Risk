from fastapi import Depends, FastAPI, File, HTTPException, Request, Response, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from agents.orchestrator import run_pipeline
from agents.pdf_utils import extract_text_from_pdf
from auth import (
    authenticate_user,
    create_user,
    end_session,
    get_current_user,
    initialize_auth,
    start_session,
)

app = FastAPI(title="MSME Credit Risk API")
initialize_auth()

# Allow the React frontend (running on a different port) to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AssessmentRequest(BaseModel):
    business_text: str


class AuthRequest(BaseModel):
    email: str
    password: str


@app.post("/auth/signup")
def signup(request: AuthRequest, response: Response):
    if len(request.password) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters.")
    user = create_user(request.email, request.password)
    start_session(user["id"], response)
    return user


@app.post("/auth/login")
def login(request: AuthRequest, response: Response):
    user = authenticate_user(request.email, request.password)
    start_session(user["id"], response)
    return user


@app.get("/auth/me")
def session_user(request: Request):
    return get_current_user(request)


@app.post("/auth/logout")
def logout(request: Request, response: Response):
    end_session(request, response)
    return {"status": "signed out"}

@app.get("/")
def read_root():
    return {"status": "MSME Credit Risk API running"}

@app.post("/assess")
def assess_business(request: AssessmentRequest, current_user=Depends(get_current_user)):
    result = run_pipeline(request.business_text)
    return result

@app.post("/assess-pdf")
async def assess_business_pdf(
    file: UploadFile = File(...), current_user=Depends(get_current_user)
):
    file_bytes = await file.read()
    extracted_text = extract_text_from_pdf(file_bytes)

    if not extracted_text:
        return {"error": "Could not extract text from PDF. It may be a scanned image without selectable text."}

    result = run_pipeline(extracted_text)
    return result