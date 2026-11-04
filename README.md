# MSME Credit Risk

An explainable MSME credit-risk assessment application. It extracts financial information from business text or PDFs, evaluates risk using an Ollama language model, reviews the assessment with a critic agent, and presents officer-ready explanations in a React frontend.

## Features

- Email/password authentication with session cookies
- Business-text and PDF assessment workflows
- Financial data extraction and risk scoring
- Retrieval-augmented guidance from the local knowledge base
- Critic review and explainable recommendations
- React and Vite frontend

## Prerequisites

- Python 3.10+
- Node.js and npm
- [Ollama](https://ollama.com/) with the `llama3.1` model

Pull the model before starting the backend:

```bash
ollama pull llama3.1
```

## Backend setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install fastapi uvicorn python-multipart pydantic ollama chromadb pypdf fpdf2
python setup_rag.py
uvicorn main:app --reload --port 8001
```

The API runs at `http://localhost:8001`.

## Frontend setup

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend runs at `http://localhost:5173`.

## API endpoints

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/auth/signup` | Create an account |
| `POST` | `/auth/login` | Sign in |
| `POST` | `/auth/logout` | Sign out |
| `GET` | `/auth/me` | Get the current user |
| `POST` | `/assess` | Assess business text |
| `POST` | `/assess-pdf` | Assess an uploaded PDF |

## Development checks

```bash
cd frontend
npm run lint
npm run build
```

Backend runtime data such as the authentication database, Chroma index, virtual environment, and generated PDFs is intentionally excluded from Git.
