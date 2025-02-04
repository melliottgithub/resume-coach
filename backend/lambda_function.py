from fastapi.middleware.cors import CORSMiddleware
import dynamodb.repositories as db
import object_storage_s3.repositories as object_storage
from api.resources import app

from mangum import Mangum

lambda_handler = Mangum(app) # This is what Lambda will call