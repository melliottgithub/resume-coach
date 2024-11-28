import base64
from fastapi import Depends, FastAPI, HTTPException
from fastapi.responses import PlainTextResponse
from services.service import JobApplicationService
from .access_token import encode_jwt, verify_token
from . import models

app = FastAPI()

job_application_service = JobApplicationService()

def create_root():
    return {"ok": True}

@app.get("/")
async def root():
    return {"ok": True}

# Auth endpoints

@app.post("/auth")
async def auth(request: models.AuthRequest):
    user = job_application_service.authenticate_user(request.email, request.password)
    access_token = encode_jwt(user.id.hex)
    return models.AuthResponse(user_name=user.name, access_token=access_token, token_type="Bearer")
        
# Users Endpoints

@app.get("/users/me", dependencies=[Depends(verify_token)])
async def user(user_id = Depends(verify_token)) -> models.UserResponse:
    user = job_application_service.get_user_by_id(user_id)
    return models.UserResponse(id=user.id.hex, name=user.name, email=user.email)

@app.post("/users")
async def user(request: models.UserRequest) -> models.UserResponse:
    user = job_application_service.create_user(request.name, request.email, request.password)
    return models.UserResponse(id=user.id.hex, name=user.name, email=user.email)

# Jobs Endpoints

@app.get("/jobs")
async def jobs(limit: int = 10, last_key_value: str = None) -> models.JobPaginedList:
    jobs, new_last_key_value = job_application_service.list_jobs(limit=limit, last_key_value=last_key_value)
    return models.JobPaginedList(items=jobs, limit=limit, last_key_value=new_last_key_value)

@app.get("/jobs/{id}")
async def job(id: str):
    return job_application_service.get_job_by_id(id)

@app.get("/jobs/{id}/description",
         response_class=PlainTextResponse,
         responses={200: {"content": {"text/plain": {}}}})
async def get_job_description(id: str):
    return job_application_service.get_job_description_by_id(id)

# Job Application Endpoints

@app.get("/applications", dependencies=[Depends(verify_token)])
async def get_applications(user_id = Depends(verify_token), limit: int = 10):
    return job_application_service.list_applications(user_id, limit=limit)

@app.post("/applications", dependencies=[Depends(verify_token)])
async def create_applications(request: models.JobApplicationRequest, user_id = Depends(verify_token)):
    if user_id is None:
        raise HTTPException(status_code=403, detail="Forbidden")
    if bool(request.resume_text) == bool(request.resume_file_base64):
        raise HTTPException(status_code=400, detail="Either resume_text or resume_file_base64 must be provided, but not both.")

    job_application = job_application_service.create_application(
        user_id=user_id, job_id=request.job_id, resume_text=request.resume_text,
        resume_file=decode_base64(request.resume_file_base64))
    return job_application

@app.post("/applications/{id}/analyze",
          response_class=PlainTextResponse,
          responses={200: {"content": {"text/plain": {}}}},
          dependencies=[Depends(verify_token)])
async def applications_analyze(id: str, user_id = Depends(verify_token)):
    return job_application_service.create_application_analysis(user_id, id)

@app.get("/applications/{id}")
async def get_application(id: str):
    return job_application_service.get_application_details_by_id(id)

@app.get("/applications/{id}/chat")
async def applications_chat_message(id: str):
    return job_application_service.get_chat_messages(id)

@app.post("/applications/{id}/chat")
async def applications_chat_message(id: str, request: models.ChatMessageRequest):
    return job_application_service.send_chat_message(id, request.message)

def decode_base64(data: str) -> bytes:
    if data is None:
        return None
    try:
        return base64.b64decode(data)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid base64 data: {str(e)}")