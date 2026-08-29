from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func

from database import Base


class Problem(Base):
    __tablename__ = "problems"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)

    category = Column(String(100), nullable=False)
    district = Column(String(100), nullable=False)
    location = Column(String(255), nullable=False)
    photo_path = Column(String(255), nullable=True)

    status = Column(String(50), default="Submitted")

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )