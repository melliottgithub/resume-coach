from fastapi.middleware.cors import CORSMiddleware
import dynamodb.repositories as db
import object_storage_s3.repositories as object_storage
from api.resources import app

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
