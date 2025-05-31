from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import patient, doctor, user, upload, data, consents

app = FastAPI(
    title="Local Node Management API",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(patient.router, prefix="/users", tags=["Patient"])
app.include_router(doctor.router, prefix="/users", tags=["Doctor"])
app.include_router(user.router, prefix="/users", tags=["User"])
app.include_router(upload.router, prefix="/upload", tags=["Upload"])
app.include_router(data.router, prefix="/pseudo", tags=["Data"])
app.include_router(consents.router, prefix="/consents", tags=["Consents"])
