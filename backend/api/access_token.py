import time
import os
import jwt
from typing import Annotated
from fastapi import HTTPException, Header

JWT_SECRET = os.getenv("JWT_SECRET")
if JWT_SECRET is None:
    raise ValueError("JWT_SECRET is not set")

def encode_jwt(user_id: str) -> str:
    payload = {
        "sub": user_id,
        "iat": int(time.time())
    }
    return jwt.encode(payload, JWT_SECRET, algorithm="HS256")
    
def decode_jwt(token: str) -> str:
    try:
        return jwt.decode(token, JWT_SECRET, algorithms=["HS256"]).get("sub")
    except jwt.ExpiredSignatureError:
        print("decode_jwt: Token has expired")
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError:
        print("decode_jwt: Invalid token")
        raise HTTPException(status_code=401, detail="Invalid token")
    
# Custom dependency for token validation
def verify_token(authorization: Annotated[str | None, Header()] = None):
    token = authorization.split(" ")[1]
    return decode_jwt(token)