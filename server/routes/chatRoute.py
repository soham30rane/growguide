from fastapi import APIRouter, HTTPException
from supabase import create_client, Client
import os

router = APIRouter()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

@router.get("/one-to-one-chat/{uid}")
async def get_one_to_one_chat(uid: str):
    try:
        # Query the one_to_one_chat table for matching uid1 or uid2
        response = supabase.table("one_to_one_chat").select("uid1, uid2").or_(f"uid1.eq.{uid},uid2.eq.{uid}").execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="No chats found")

        # Extract the other user's UID
        other_uids = [
            chat["uid2"] if chat["uid1"] == uid else chat["uid1"]
            for chat in response.data
        ]

        # Query the users table for details of the other users
        user_response = supabase.table("users").select("uid, username, roles").in_("uid", other_uids).execute()
        if not user_response.data:
            raise HTTPException(status_code=404, detail="No users found")

        return user_response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")
