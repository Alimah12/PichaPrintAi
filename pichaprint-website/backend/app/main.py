from fastapi import FastAPI, Depends, HTTPException, status, Header
from fastapi.middleware.cors import CORSMiddleware
import os
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from datetime import datetime, timedelta

from .database import SessionLocal, init_db
from . import models, schemas, auth

init_db()

app = FastAPI(title="pichaprint-backend")

# Configure allowed origins via env var `FRONTEND_ORIGINS` (comma-separated).
# When `allow_credentials=True`, do NOT use '*' for origins — provide explicit origins.
raw_origins = os.getenv('FRONTEND_ORIGINS', 'https://picha-print-ai.vercel.app,http://localhost:3000')
allow_origins = [o.strip() for o in raw_origins.split(',') if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
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
def list_designs(user_id: int | None = None, db: Session = Depends(get_db)):
    """
    Public endpoint to list designs. If `user_id` is provided, returns designs for that user,
    otherwise returns all designs ordered by id desc.
    """
    query = db.query(models.Design)
    if user_id is not None:
        query = query.filter(models.Design.user_id == user_id)
    items = query.order_by(models.Design.id.desc()).all()
    return items


@app.get('/designs/{design_id}', response_model=schemas.DesignOut)
def get_design(design_id: int, db: Session = Depends(get_db)):
    """Public endpoint to fetch a single design by id."""
    item = db.query(models.Design).filter(models.Design.id == design_id).first()
    if not item:
        raise HTTPException(status_code=404, detail='Design not found')
    return item


@app.post('/admin/login')
def admin_login(creds: dict):
    """Admin login using deploy-time credentials (ADMIN_USERNAME / ADMIN_PASSWORD env vars).

    Returns a JWT with {'admin': True} when credentials match.
    """
    admin_user = os.getenv('ADMIN_USERNAME', 'PichaAdmin')
    admin_pass = os.getenv('ADMIN_PASSWORD', 'PichaAdmin@123')
    username = creds.get('username')
    password = creds.get('password')
    if not username or not password:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Missing credentials')
    if username != admin_user or password != admin_pass:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Invalid admin credentials')
    token = auth.create_access_token({'admin': True})
    return {'access_token': token}


@app.get('/admin/analytics')
def admin_analytics(authorization: str | None = Header(None), db: Session = Depends(get_db)):
    """Protected admin analytics: requires `Authorization: Bearer <token>` with admin claim."""
    if not authorization or not authorization.startswith('Bearer '):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail='Forbidden')
    token = authorization.split(' ', 1)[1]
    payload = auth.decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail='Forbidden')

    # Accept tokens issued by `admin_login` (with {'admin': True})
    if payload.get('admin'):
        allowed = True
    else:
        # Otherwise expect a normal user token with 'sub' and verify the user has is_admin
        allowed = False
        if 'sub' in payload:
            try:
                uid = int(payload['sub'])
                u = db.query(models.User).filter(models.User.id == uid).first()
                if u and getattr(u, 'is_admin', False):
                    allowed = True
            except Exception:
                allowed = False

    if not allowed:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail='Forbidden')

    users = db.query(models.User).all()
    out = []
    for u in users:
        ds = db.query(models.Design).filter(models.Design.user_id == u.id).order_by(models.Design.id.desc()).all()
        out.append({
            'id': u.id,
            'username': u.username,
            'email': u.email,
            'first_name': u.first_name,
            'last_name': u.last_name,
            'country': u.country,
            'phone': u.phone,
            'designs': [
                {
                    'id': d.id,
                    'input_text': d.input_text,
                    'timestamp': d.timestamp,
                    'output_json': d.output_json
                } for d in ds
            ]
        })

    return out
