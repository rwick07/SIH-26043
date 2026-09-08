from pgvector.sqlalchemy import Vector
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.sql import func

from database import Base


class Problem(Base):
    __tablename__ = "problems"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer,ForeignKey("users.id"),nullable=True)
    university_id = Column(Integer, ForeignKey("users.id"), nullable=True)

    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)

    category = Column(String(100), nullable=False)
    district = Column(String(100), nullable=False)
    location = Column(String(255), nullable=False)
    photo_path = Column(String(255), nullable=True)
    
    ai_category = Column(String(100), nullable=True)
    ai_priority = Column(String(50), nullable=True)
    ai_summary = Column(Text, nullable=True)
    ai_solution = Column(Text, nullable=True)
    ai_pattern_note = Column(Text, nullable=True)
    embedding = Column(Vector(768), nullable=True)
    ai_keywords = Column(Text, nullable=True)

    status = Column(String(50), default="Submitted")

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String(100), nullable=False)

    email = Column(String(150), unique=True, nullable=False, index=True)

    password = Column(String(255), nullable=False)

    role = Column(String(50), nullable=False, default="Citizen")

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    problem_id = Column(Integer, ForeignKey("problems.id"), nullable=False)
    university_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)

    status = Column(String(50), default="Proposed")
    progress = Column(Integer, default=0)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )