from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from fastapi.staticfiles import StaticFiles


from database import engine, SessionLocal
from models import Problem as ProblemModel

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

ProblemModel.metadata.create_all(bind=engine)


@app.get("/")
def home():
    return {
        "message": "SIH 26043 Backend is running!"
    }


@app.post("/problems")
async def create_problem(
    title: str = Form(...),
    description: str = Form(...),
    category: str = Form(...),
    district: str = Form(...),
    location: str = Form(...),
    file: UploadFile | None = File(None)
):
    db = SessionLocal()

    try:
        photo_path = None

        if file:
            file_path = f"uploads/{file.filename}"

            with open(file_path, "wb") as buffer:
                buffer.write(await file.read())

            photo_path = file_path

        new_problem = ProblemModel(
            title=title,
            description=description,
            category=category,
            district=district,
            location=location,
            photo_path=photo_path
        )

        db.add(new_problem)
        db.commit()
        db.refresh(new_problem)

        return {
            "message": "Problem saved successfully",
            "problem_id": new_problem.id,
            "photo": photo_path
        }

    finally:
        db.close()

@app.get("/problems")
def get_problems():

    db = SessionLocal()

    try:
        problems = db.query(ProblemModel).all()

        return problems

    finally:
        db.close()

@app.post("/upload-photo")
async def upload_photo(file: UploadFile = File(...)):

    file_path = f"uploads/{file.filename}"

    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())

    return {
        "message": "Photo uploaded successfully",
        "filename": file.filename
    }

@app.get("/problems/{problem_id}")
def get_problem(problem_id: int):

    db = SessionLocal()

    try:
        problem = db.query(ProblemModel).filter(
            ProblemModel.id == problem_id
        ).first()

        if not problem:
            raise HTTPException(
                status_code=404,
                detail="Problem not found"
            )

        return problem

    finally:
        db.close()