from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from datetime import datetime, timedelta

from .database import SessionLocal, init_db
from . import models, schemas, auth

init_db()

app = FastAPI(title="pichaprint-backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

security = HTTPBearer()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)):
    token = credentials.credentials
    payload = auth.decode_access_token(token)
    if not payload or 'sub' not in payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Invalid authentication')
    user = db.query(models.User).filter(models.User.id == int(payload['sub'])).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='User not found')
    return user


# OTP flow removed — signup is direct and no email verification is required.


@app.post('/auth/signup', response_model=schemas.Token)
def signup(user_in: schemas.UserSignup, db: Session = Depends(get_db)):
    # Basic uniqueness checks
    if db.query(models.User).filter(models.User.email == user_in.email).first():
        raise HTTPException(status_code=400, detail='Email already registered')
    if db.query(models.User).filter(models.User.username == user_in.username).first():
        raise HTTPException(status_code=400, detail='Username already in use')

    user = models.User(
        username=user_in.username,
        first_name=user_in.first_name,
        last_name=user_in.last_name,
        email=user_in.email,
        country=user_in.country,
        phone=user_in.phone,
        hashed_password=auth.get_password_hash(user_in.password)
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = auth.create_access_token({'sub': str(user.id)})
    return {'access_token': token}


@app.post('/auth/login', response_model=schemas.Token)
def login(user_in: schemas.UserCreate, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == user_in.email).first()
    if not user or not auth.verify_password(user_in.password, user.hashed_password):
        raise HTTPException(status_code=400, detail='Invalid credentials')
    # No email verification required (OTP flow removed)
    token = auth.create_access_token({'sub': str(user.id)})
    return {'access_token': token}


@app.get('/me', response_model=schemas.UserOut)
def read_me(current_user: models.User = Depends(get_current_user)):
    return current_user


@app.post('/designs', response_model=schemas.DesignOut)
def create_design(design_in: schemas.DesignCreate, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    design = models.Design(
        user_id=current_user.id,
        input_text=design_in.input_text,
        output_json=design_in.output_json,
        timestamp=datetime.utcnow().isoformat()
    )
    db.add(design)
    db.commit()
    db.refresh(design)
    return design


@app.get('/designs', response_model=list[schemas.DesignOut])
def list_designs(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    items = db.query(models.Design).filter(models.Design.user_id == current_user.id).order_by(models.Design.id.desc()).all()
    return items


@app.get('/designs/{design_id}', response_model=schemas.DesignOut)
def get_design(design_id: int, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    item = db.query(models.Design).filter(models.Design.id == design_id, models.Design.user_id == current_user.id).first()
    if not item:
        raise HTTPException(status_code=404, detail='Design not found')
    return item
