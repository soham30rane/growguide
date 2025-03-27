from fastapi import APIRouter, HTTPException
from supabase import create_client, Client
import os
import uuid
from models import blogReqMod, blogResMod, getBlogsResMod 
router = APIRouter()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

@router.post("/create-blog",response_model=blogResMod)
async def create_blog(req: blogReqMod):
    try:
        blog_id = str(uuid.uuid4())

        supabase.table("blog").insert({
            "blogid": blog_id,
            "uid": req.uid,
            "blog_title": req.blogTitle,
            "blog_content": req.blogContent
        }).execute()

        for tag in req.tags:
            supabase.table("blogtag").insert({
                "blogid": blog_id,
                "tag": tag
            }).execute()

        return {"error": False}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred during blog creation: {str(e)}")

@router.get("/get-blogs", response_model=getBlogsResMod)
async def get_blogs():
    try:
        blogs_response = supabase.table("blog").select("*").execute()
        blogs = blogs_response.data

        if not blogs:
            return {"blogs": []}

        for blog in blogs:
            tags_response = supabase.table("blogtag").select("tag").eq("blogid", blog["blogid"]).execute()
            blog["tags"] = [tag["tag"] for tag in tags_response.data]

        return {"blogs": blogs}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred while fetching blogs: {str(e)}")
