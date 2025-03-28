from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from routes.authRoute import router as auth_router
from routes.plantRoute import router as plant_router
from routes.blogRoute import router as blog_router
from routes.groupRoute import router as group_router
from routes.chatRoute import router as chat_router

load_dotenv()  # Ensure this is called to load environment variables

app = FastAPI()

allowed_origin = ["http://localhost:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origin,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/auth")
app.include_router(plant_router, prefix="/plant")
app.include_router(blog_router, prefix="/blog")
app.include_router(group_router, prefix="/group")
app.include_router(chat_router, prefix="/chat")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
