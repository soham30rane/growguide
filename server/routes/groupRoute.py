from fastapi import APIRouter, HTTPException
from supabase import create_client, Client
import os
import uuid
from models import createGroupReqMod,createGroupResMod

router = APIRouter()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

@router.post("/create-group", response_model=createGroupResMod)
async def create_group(req: createGroupReqMod):
    try:
        group_id = str(uuid.uuid4())
        room_id = str(uuid.uuid4())

        supabase.table("groupchat").insert({
            "groupid": group_id,
            "groupname": req.groupname,
            "roomid": room_id
        }).execute()

        for uid in req.uids:
            group_user_id = str(uuid.uuid4())
            supabase.table("groupchatusers").insert({
                "groupuserid": group_user_id,
                "groupid": group_id,
                "uid": uid
            }).execute()

        return {"error": False, "message": "Group created successfully", "groupid": group_id, "roomid": room_id}
    except Exception as e:
        return {"error": True, "message": f"An error occurred while creating the group: {str(e)}"}
