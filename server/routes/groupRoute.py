from fastapi import APIRouter, HTTPException
from supabase import create_client, Client
import os
import uuid
from models import createGroupReqMod, createGroupResMod, getGroupReqMod, getGroupResMod 

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

@router.post("/get-group", response_model=getGroupResMod)
async def get_room(req: getGroupReqMod):
    try:
        # Fetch all group IDs associated with the given UID
        group_user_response = supabase.table("groupchatusers").select("groupid").eq("uid", req.uid).execute()
        group_ids = list({entry["groupid"] for entry in group_user_response.data})

        if not group_ids:
            return {"error": False, "groups": []}

        # Fetch group details for each group ID
        groups = []
        for group_id in group_ids:
            group_response = supabase.table("groupchat").select("groupid, groupname, roomid").eq("groupid", group_id).execute()
            if group_response.data:
                groups.append(group_response.data[0])

        return {"error": False, "groups": groups}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred while fetching rooms: {str(e)}")
