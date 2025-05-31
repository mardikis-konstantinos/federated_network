from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import user, nodes

app = FastAPI(
    title="Web Node Management API",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(user.router, prefix="/users", tags=["User"])
app.include_router(nodes.router, prefix="/nodes", tags=["Node"])
