from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from fastapi.staticfiles import StaticFiles
from pwdlib import PasswordHash
import jwt

from database import engine, SessionLocal
from models import Problem as ProblemModel, User, Project

app = FastAPI()

password_hash = PasswordHash.recommended()
security = HTTPBearer()
SECRET_KEY = "janSetu-secret-key-change-later"
ALGORITHM = "HS256"

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

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    token = credentials.credentials

    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        user_id = payload.get("user_id")

        if not user_id:
            raise HTTPException(
                status_code=401,
                detail="Invalid authentication token"
            )

        db = SessionLocal()

        try:
            user = db.query(User).filter(
                User.id == user_id
            ).first()

            if not user:
                raise HTTPException(
                    status_code=401,
                    detail="User not found"
                )

            return user

        finally:
            db.close()

    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=401,
            detail="Invalid authentication token"
        )

def get_current_government(
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "Government":
        raise HTTPException(
            status_code=403,
            detail="Government access required"
        )

    return current_user

def get_current_university(
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "University":
        raise HTTPException(
            status_code=403,
            detail="University access required"
        )

    return current_user

@app.get("/")
def home():
    return {
        "message": "SIH 26043 Backend is running!"
    }

@app.post("/register")
def register_user(
    name: str = Form(...),
    email: str = Form(...),
    password: str = Form(...),
    role: str = Form("Citizen")
):
    db = SessionLocal()

    try:
        existing_user = db.query(User).filter(
            User.email == email
        ).first()

        if existing_user:
            raise HTTPException(
                status_code=400,
                detail="Email already registered"
            )

        hashed_password = password_hash.hash(password)

        new_user = User(
            name=name,
            email=email,
            password=hashed_password,
            role=role
        )

        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        return {
            "message": "User registered successfully",
            "user_id": new_user.id,
            "name": new_user.name,
            "email": new_user.email,
            "role": new_user.role
        }

    finally:
        db.close()

@app.post("/login")
def login_user(
    email: str = Form(...),
    password: str = Form(...)
):
    db = SessionLocal()

    try:
        user = db.query(User).filter(
            User.email == email
        ).first()

        if not user:
            raise HTTPException(
                status_code=401,
                detail="Invalid email or password"
            )

        if not password_hash.verify(password, user.password):
            raise HTTPException(
                status_code=401,
                detail="Invalid email or password"
            )

        token_data = {
            "user_id": user.id,
            "role": user.role
        }

        token = jwt.encode(
            token_data,
            SECRET_KEY,
            algorithm=ALGORITHM
        )

        return {
            "message": "Login successful",
            "token": token,
            "user": {
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "role": user.role
            }
        }

    finally:
        db.close()

@app.post("/problems")
async def create_problem(
    title: str = Form(...),
    description: str = Form(...),
    category: str = Form(...),
    district: str = Form(...),
    location: str = Form(...),
    file: UploadFile | None = File(None),
    current_user: User = Depends(get_current_user)
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
            photo_path=photo_path,
            user_id=current_user.id,
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

@app.get("/my-problems")
def get_my_problems(
    current_user: User = Depends(get_current_user)
):
    db = SessionLocal()

    try:
        problems = db.query(ProblemModel).filter(
            ProblemModel.user_id == current_user.id
        ).all()

        return problems

    finally:
        db.close()

@app.get("/all-problems")
def get_all_problems(
    current_user: User = Depends(get_current_government)
):
    db = SessionLocal()

    try:
        problems = db.query(ProblemModel).all()

        return problems

    finally:
        db.close()

@app.get("/university-problems")
def get_university_problems(
    current_user: User = Depends(get_current_university)
):
    db = SessionLocal()

    try:
        problems = db.query(ProblemModel).filter(
            ProblemModel.status == "Accepted"
        ).all()

        return problems

    finally:
        db.close()

@app.put("/problems/{problem_id}/take-up")
def take_up_problem(
    problem_id: int,
    current_user: User = Depends(get_current_university)
):
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

        if problem.status != "Accepted":
            raise HTTPException(
                status_code=400,
                detail="Only accepted problems can be taken up"
            )

        if problem.university_id is not None:
            raise HTTPException(
                status_code=400,
                detail="Problem has already been taken up"
            )

        problem.university_id = current_user.id

        db.commit()
        db.refresh(problem)

        return {
            "message": "Problem taken up successfully",
            "problem_id": problem.id,
            "university_id": current_user.id
        }

    finally:
        db.close()  

@app.post("/projects")
def create_project(
    problem_id: int,
    title: str,
    description: str,
    current_user: User = Depends(get_current_university)
):
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

        if problem.university_id != current_user.id:
            raise HTTPException(
                status_code=403,
                detail="You can only create a project for a problem taken up by your university"
            )

        existing_project = db.query(Project).filter(
            Project.problem_id == problem_id
        ).first()

        if existing_project:
            raise HTTPException(
                status_code=400,
                detail="A project already exists for this problem"
            )

        new_project = Project(
            problem_id=problem_id,
            university_id=current_user.id,
            title=title,
            description=description
        )

        db.add(new_project)
        db.commit()
        db.refresh(new_project)

        return {
            "message": "Project created successfully",
            "project_id": new_project.id,
            "problem_id": new_project.problem_id,
            "university_id": new_project.university_id,
            "title": new_project.title,
            "description": new_project.description,
            "status": new_project.status
        }

    finally:
        db.close()

@app.get("/my-projects")
def get_my_projects(
    current_user: User = Depends(get_current_university)
):
    db = SessionLocal()

    try:
        projects = db.query(Project).filter(
            Project.university_id == current_user.id
        ).all()

        return projects

    finally:
        db.close()

@app.get("/government-projects")
def get_government_projects(
    current_user: User = Depends(get_current_government)
):
    db = SessionLocal()

    try:
        projects = db.query(Project).all()

        result = []

        for project in projects:
            problem = db.query(ProblemModel).filter(
                ProblemModel.id == project.problem_id
            ).first()

            university = db.query(User).filter(
                User.id == project.university_id
            ).first()

            result.append({
                "id": project.id,
                "title": project.title,
                "description": project.description,
                "status": project.status,
                "progress": project.progress,
                "problem_id": project.problem_id,
                "problem_title": problem.title if problem else "Unknown Problem",
                "university_id": project.university_id,
                "university_name": university.name if university else "Unknown University"
            })

        return result

    finally:
        db.close()

@app.put("/projects/{project_id}/progress")
def update_project_progress(
    project_id: int,
    progress: int,
    status: str,
    current_user: User = Depends(get_current_university)
):
    db = SessionLocal()

    try:
        project = db.query(Project).filter(
            Project.id == project_id
        ).first()

        if not project:
            raise HTTPException(
                status_code=404,
                detail="Project not found"
            )

        if project.university_id != current_user.id:
            raise HTTPException(
                status_code=403,
                detail="You can only update your own university's projects"
            )

        if progress < 0 or progress > 100:
            raise HTTPException(
                status_code=400,
                detail="Progress must be between 0 and 100"
            )

        if status not in ["Proposed", "In Progress", "Completed"]:
            raise HTTPException(
                status_code=400,
                detail="Invalid project status"
            )

        project.progress = progress
        project.status = status

        db.commit()
        db.refresh(project)

        return {
            "message": "Project progress updated successfully",
            "project_id": project.id,
            "status": project.status,
            "progress": project.progress
        }

    finally:
        db.close()

@app.post("/problems/{problem_id}/analyze")
def analyze_problem(problem_id: int):

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

        # Temporary mock AI result
        ai_category = problem.category
        ai_priority = "Medium"
        ai_summary = problem.description[:150]
        ai_keywords = "community, problem, local"

        problem.ai_category = ai_category
        problem.ai_priority = ai_priority
        problem.ai_summary = ai_summary
        problem.ai_keywords = ai_keywords

        db.commit()
        db.refresh(problem)

        return {
            "message": "Problem analyzed successfully",
            "problem_id": problem.id,
            "ai_category": problem.ai_category,
            "ai_priority": problem.ai_priority,
            "ai_summary": problem.ai_summary,
            "ai_keywords": problem.ai_keywords
        }

    finally:
        db.close()

@app.put("/problems/{problem_id}/status")
def update_problem_status(
    problem_id: int,
    status: str,
    current_user: User = Depends(get_current_government)
):
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

        problem.status = status

        db.commit()
        db.refresh(problem)

        return {
            "message": "Problem status updated successfully",
            "problem_id": problem.id,
            "status": problem.status
        }

    finally:
        db.close()

@app.get("/me")
def get_me(
    current_user: User = Depends(get_current_user)
):
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "role": current_user.role
    }