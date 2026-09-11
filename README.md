# JanSetu

### AI-Powered Societal Innovation & Collaboration Platform

JanSetu is a digital platform that transforms citizen-reported societal challenges into structured and actionable problems. It uses AI to analyze reported problems, identify similar challenges, suggest potential solutions, and facilitate collaboration between government and universities.

---

## Problem Statement

**SIH26043 — A digital platform to crowdsource societal challenges and facilitate collaborative problem solving through universities and industry partnerships.**

---

## How JanSetu Works

Citizen
↓
Report Problem
↓
AI Analysis
↓
Government Review
↓
University Takes Up Problem
↓
Project Creation
↓
Progress & Lifecycle Tracking

---

## Key Features

### Citizen
- Register and login
- Report societal problems
- Upload supporting images
- Track submitted problems

### AI Analysis
- Problem classification
- Priority detection
- Summary generation
- Keyword extraction
- Similar problem detection
- Suggested solution generation
- Pattern insights

### Government
- Review reported problems
- Search and filter problems
- Accept problems for collaboration
- Monitor university projects
- Track project progress

### University
- View accepted problems
- Take up problems
- Create projects
- Update project progress
- Track project lifecycle

---

## AI Pipeline

1. Citizen submits a problem.
2. Gemini analyzes the problem.
3. Category and priority are determined.
4. Summary and keywords are generated.
5. Gemini Embeddings generate a vector representation.
6. pgvector searches for similar problems.
7. Gemini generates a suggested solution and pattern insight.

---

## Technology Stack

| Component | Technology |
|---|---|
| Frontend | React + Vite |
| Backend | Python + FastAPI |
| Database | PostgreSQL |
| ORM | SQLAlchemy |
| AI | Google Gemini API |
| Embeddings | Gemini Embeddings |
| Vector Search | pgvector |
| Authentication | JWT |
| Version Control | Git + GitHub |

---

## Project Workflow

### 1. Citizen Reporting
Citizens submit societal problems with descriptions, categories, locations and optional evidence.

### 2. AI Processing
The submitted problem is automatically analyzed and enriched with structured AI insights.

### 3. Government Review
Government users review submitted problems and accept suitable challenges for collaboration.

### 4. University Collaboration
Universities can take up accepted problems and create projects to work on potential solutions.

### 5. Project Tracking
Projects can be tracked through:

- Proposal
- Prototype Development
- Field Testing
- Implementation

---

## Project Structure

SIH-26043/
├── frontend/
├── backend/
│   ├── main.py
│   ├── database.py
│   ├── models.py
│   └── ai_service.py
├── .gitignore
└── README.md

---

## Running Locally

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt

Start the backend:

```bash
uvicorn main:app --reload
```

The FastAPI backend will run locally on port `8000`.

FastAPI Swagger documentation is available at:

`http://127.0.0.1:8000/docs`

---

### Frontend

Open another terminal and navigate to the frontend:

```bash
cd frontend
npm install
npm run dev
```

The React development server will run locally on port `5173`.

---

## How JanSetu Works

```text
Citizen
   ↓
Report Societal Problem
   ↓
AI Analysis
   ↓
Government Review
   ↓
University Takes Up Problem
   ↓
Project Creation
   ↓
Project Development
   ↓
Progress & Lifecycle Tracking
```

---

## AI Pipeline

1. A citizen submits a societal problem.
2. Gemini analyzes the submitted problem.
3. The problem is classified into a relevant category.
4. AI determines the priority level.
5. A concise summary and relevant keywords are generated.
6. Gemini Embeddings convert the problem into a vector representation.
7. pgvector searches for similar previously reported problems.
8. Gemini generates a suggested solution and pattern insight.

---

## Project Lifecycle

University projects can be tracked through four stages:

- Proposal
- Prototype Development
- Field Testing
- Implementation

Universities can update the completion status of each stage as the project progresses.

---

## Technology Stack

| Component | Technology |
|---|---|
| Frontend | React + Vite |
| Backend | Python + FastAPI |
| Database | PostgreSQL |
| ORM | SQLAlchemy |
| AI | Google Gemini API |
| Embeddings | Gemini Embeddings |
| Vector Search | pgvector |
| Authentication | JWT |
| Password Hashing | pwdlib |
| Version Control | Git + GitHub |

---

## User Roles

### Citizen

- Register and log in
- Report societal problems
- Upload supporting images
- View submitted problems
- Track problem status

### Government

- View reported problems
- Search and filter problems
- Review AI-generated analysis
- Accept problems for university collaboration
- Update problem status
- Monitor university projects
- Track project progress and lifecycle

### University

- View accepted problems
- Take up problems for collaboration
- Create projects
- Update project status
- Update project progress
- Track project lifecycle

---

## Project Structure

```text
SIH-26043/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.jsx
│   │   └── pages/
│   │       ├── Home.jsx
│   │       ├── ReportProblem.jsx
│   │       ├── Problems.jsx
│   │       ├── ProblemDetails.jsx
│   │       ├── Login.jsx
│   │       ├── Register.jsx
│   │       └── Dashboard.jsx
│   └── ...
│
├── backend/
│   ├── main.py
│   ├── database.py
│   ├── models.py
|   ├── requirements.txt
│   ├── ai_service.py
│   ├── .env
│   └── uploads/
│
├── .gitignore
└── README.md
```

> `.env`, uploaded files, virtual environments, and generated Python cache files are excluded from version control.

---

## Current MVP Workflow

The current JanSetu MVP demonstrates the complete core workflow:

```text
Problem Reporting
       ↓
AI Analysis
       ↓
Government Review
       ↓
University Collaboration
       ↓
Project Creation
       ↓
Progress Tracking
       ↓
Lifecycle Tracking
```

The MVP focuses on transforming citizen-reported societal challenges into structured problems and enabling collaboration between government and universities to develop potential solutions.

---

## Future Scope

Future versions of JanSetu can include:

- Industry and startup participation
- Automated university routing based on expertise
- Geographic problem heatmaps
- Advanced analytics dashboards
- Government department-wise routing
- Real-time notifications
- Multilingual and voice-based reporting
- Mobile application
- Advanced project collaboration
- Impact and outcome measurement

---

## Team
- Ritwik Chawda - (Me) - [LinkedIn](https://www.linkedin.com/in/ritwik-chawda-a44718338/)
- Rudraksh Sivam Dutta
- Rohith Jain
- Likitha
- Saksham
- Vatsal
  
### Team JanSetu

**Smart India Hackathon 2026**

**Problem Statement:** SIH26043
