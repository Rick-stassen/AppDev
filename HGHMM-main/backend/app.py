from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, DateTime, JSON, ForeignKey, Boolean
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker, Session, relationship
from datetime import datetime, timedelta
from pydantic import BaseModel, EmailStr, field_validator, ConfigDict
from typing import Optional, Dict, Any, List
import json
import os
import logging
import sys
from dotenv import load_dotenv
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from sqlalchemy.sql import text

# Configure logging
logging.basicConfig(
    filename='app.log',
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Database connection
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    logger.error("No DATABASE_URL set in environment variables")
    print("Error: No DATABASE_URL set in environment variables")
    sys.exit(1)

try:
    # Create engine with connection pooling and retry settings
    engine = create_engine(
        DATABASE_URL,
        pool_size=5,
        max_overflow=10,
        pool_timeout=30,
        pool_recycle=1800,
        pool_pre_ping=True,
        connect_args={
            "connect_timeout": 30,
            "read_timeout": 30,
            "write_timeout": 30
        }
    )
    
    # Test connection
    with engine.connect() as conn:
        conn.execute(text("SELECT 1"))
        logger.info("Database connection successful")
except Exception as e:
    logger.error(f"Database connection failed: {str(e)}")
    print(f"Error: Could not connect to database - {str(e)}")
    print("Please check your database connection settings in .env file")
    print(f"Current connection URL: {DATABASE_URL}")
    print("\nPossible issues:")
    print("1. Wrong port number (should be 5433)")
    print("2. Database server is not running")
    print("3. Firewall is blocking the connection")
    print("4. Network connectivity issues")
    print("\nTry:")
    print("1. Verify the port number")
    print("2. Check if you can ping the server")
    print("3. Check if the database server is running")
    print("4. Check your firewall settings")
    sys.exit(1)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Database Models
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    answers = relationship("Answer", back_populates="user")

class Answer(Base):
    __tablename__ = "answers"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    role = Column(String(50))
    answers = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    user = relationship("User", back_populates="answers")

class UserSettingsDB(Base):
    __tablename__ = "user_settings"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    push_notifications = Column(Boolean, default=True)
    wist_je_dat = Column(Boolean, default=True)
    sounds = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

# Create tables
Base.metadata.create_all(bind=engine)

# Pydantic Models
class UserBase(BaseModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    name: str

    @field_validator('name')
    def name_must_not_be_empty(cls, v):
        if not v.strip():
            raise ValueError('Name must not be empty')
        return v.strip()

class UserCreate(UserBase):
    pass

class UserUpdate(UserBase):
    pass

class UserInDB(UserBase):
    model_config = ConfigDict(arbitrary_types_allowed=True, from_attributes=True)
    id: int
    is_active: bool
    created_at: datetime
    updated_at: datetime

class AnswerBase(BaseModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    user_id: int
    role: str
    answers: Dict[str, Any]

class AnswerCreate(AnswerBase):
    pass

class AnswerInDB(AnswerBase):
    model_config = ConfigDict(arbitrary_types_allowed=True, from_attributes=True)
    id: int
    created_at: datetime
    updated_at: datetime

class UserSettingsSchema(BaseModel):
    model_config = ConfigDict(arbitrary_types_allowed=True, from_attributes=True)
    user_id: int
    push_notifications: bool = True
    wist_je_dat: bool = True
    sounds: bool = True

app = FastAPI(
    title="HGHMM API",
    description="API for Hoe Gaat Het Met Mij application",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Error handlers
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    logger.error(f"HTTP error occurred: {exc.detail}")
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
    )

# User endpoints
@app.post("/users/", response_model=UserInDB)
async def create_user(user: UserCreate, db: Session = Depends(get_db)):
    try:
        db_user = User(**user.model_dump())
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        
        # Create default settings for user
        user_settings = UserSettingsDB(user_id=db_user.id)
        db.add(user_settings)
        db.commit()
        
        logger.info(f"Created new user: {db_user.id}")
        # Return full user object including id and timestamps
        return UserInDB.model_validate(db_user)
    except Exception as e:
        logger.error(f"Error creating user: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/users/{user_id}", response_model=UserBase)
async def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.put("/users/{user_id}", response_model=UserBase)
async def update_user(user_id: int, user: UserUpdate, db: Session = Depends(get_db)):
    try:
        db_user = db.query(User).filter(User.id == user_id).first()
        if not db_user:
            raise HTTPException(status_code=404, detail="User not found")
        
        for key, value in user.model_dump(exclude_unset=True).items():
            setattr(db_user, key, value)
        
        db.commit()
        db.refresh(db_user)
        logger.info(f"Updated user: {user_id}")
        return db_user
    except Exception as e:
        logger.error(f"Error updating user: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/users/{user_id}")
async def delete_user(user_id: int, db: Session = Depends(get_db)):
    try:
        # Find and delete user settings
        db.query(UserSettingsDB).filter(UserSettingsDB.user_id == user_id).delete()
        
        # Find and delete user answers
        db.query(Answer).filter(Answer.user_id == user_id).delete()
        
        # Find and delete user
        result = db.query(User).filter(User.id == user_id).delete()
        
        if result == 0:
            raise HTTPException(status_code=404, detail="User not found")
        
        db.commit()
        logger.info(f"Deleted user: {user_id}")
        return {"status": "success", "message": "User deleted successfully"}
    except Exception as e:
        logger.error(f"Error deleting user: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

# Answer endpoints
@app.post("/answers/", response_model=Dict[str, Any])
async def save_answers(answer: AnswerCreate, db: Session = Depends(get_db)):
    try:
        db_answer = Answer(**answer.model_dump())
        db.add(db_answer)
        db.commit()
        db.refresh(db_answer)
        logger.info(f"Saved answers for user: {answer.user_id}")
        return {"status": "success", "id": db_answer.id}
    except Exception as e:
        logger.error(f"Error saving answers: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/users/{user_id}/answers", response_model=List[Dict[str, Any]])
async def get_user_answers(
    user_id: int, 
    role: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Answer).filter(Answer.user_id == user_id)
    if role:
        query = query.filter(Answer.role == role)
    answers = query.all()
    return [
        {
            "id": a.id,
            "role": a.role,
            "answers": a.answers,
            "created_at": a.created_at
        } for a in answers
    ]

# Settings endpoints
@app.get("/users/{user_id}/settings", response_model=UserSettingsSchema)
async def get_user_settings(user_id: int, db: Session = Depends(get_db)):
    settings = db.query(UserSettingsDB).filter(UserSettingsDB.user_id == user_id).first()
    if not settings:
        raise HTTPException(status_code=404, detail="Settings not found")
    return settings

@app.put("/users/{user_id}/settings", response_model=UserSettingsSchema)
async def update_user_settings(
    user_id: int,
    settings: UserSettingsSchema,
    db: Session = Depends(get_db)
):
    db_settings = db.query(UserSettingsDB).filter(UserSettingsDB.user_id == user_id).first()
    if not db_settings:
        raise HTTPException(status_code=404, detail="Settings not found")
    
    for key, value in settings.model_dump().items():
        setattr(db_settings, key, value)
    
    try:
        db.commit()
        db.refresh(db_settings)
        logger.info(f"Updated settings for user: {user_id}")
        return db_settings
    except Exception as e:
        logger.error(f"Error updating settings: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow()}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)