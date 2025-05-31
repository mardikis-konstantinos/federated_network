from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import metadata, queries

app = FastAPI(
    title="Local Queries Node API",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(metadata.router, prefix="/node", tags=["Metadata"])
app.include_router(queries.router, tags=["Queries"])
