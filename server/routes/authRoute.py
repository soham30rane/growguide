from fastapi import APIRouter, HTTPException
from supabase import create_client, Client
import os
from auth import hashed_pass, verify_hash_pass, jwt_encode
import uuid
from models import registerReqMod, userResMod, loginReqMod

router = APIRouter()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

@router.post("/login", response_model=userResMod)
async def login(req: loginReqMod):
    try:
        response = supabase.table("users").select("uid, password, username, latitude, longitude, address, language_preference, description, roles").eq("phone", req.phone).single().execute()
        if not response.data:
            return {"error": True, "token": "", "username": "", "latitude": "", "longitude": "", "address": "", "language_preference": "", "description": "", "roles": ""}
        user = response.data
        if not verify_hash_pass(req.password, user["password"]):
            return {"error": True, "token": "", "username": "", "latitude": "", "longitude": "", "address": "", "language_preference": "", "description": "", "roles": ""}
        return {
            "error": False,
            "token": user["uid"],
            "username": user["username"],
            "latitude": float(user["latitude"]),
            "longitude": float(user["longitude"]),
            "address": user["address"],
            "language_preference": user["language_preference"],
            "description": user["description"],
            "roles": user["roles"]
        }
    except Exception as e:
        return {"error": True, "message": f"An error occurred during login: {str(e)}"}

@router.post("/register", response_model=userResMod)
async def register(req: registerReqMod):
    print("Hello from register")
    try:
        print("printing data", req)
        response = supabase.table("users").select("uid").eq("phone", req.phone).execute()
        if response.data:
            return {"error": True, "token": "", "username": "", "latitude": "", "longitude": "", "address": "", "language_preference": "", "description": "", "roles": ""}
        hash_pass = hashed_pass(req.password)
        response = supabase.table("users").insert({
            "uid": str(uuid.uuid4()),
            "phone": req.phone,
            "password": hash_pass,
            "username": req.username,
            "latitude": req.latitude,
            "longitude": req.longitude,
            "address": req.address,
            "language_preference": req.language_preference,
            "description": req.description,
            "roles": req.roles
        }).execute()
        user_id = response.data[0]["uid"]
        return {
            "error": False,
            "token": user_id,
            "username": req.username,
            "latitude": req.latitude,
            "longitude": req.longitude,
            "address": req.address,
            "language_preference": req.language_preference,
            "description": req.description,
            "roles": req.roles
        }
    except Exception as e:
        return {"error": True, "message": f"An error occurred during registration: {str(e)}"}

@router.post("/get-phone")
async def get_phone(uids: list[str]):
    try:
        response = supabase.table("users").select("uid, phone").in_("uid", uids).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="No users found")
        return [{"uid": user["uid"], "phone": user["phone"]} for user in response.data]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")

@router.post("/get-uid")
async def get_uid(phones: list[str]):
    try:
        response = supabase.table("users").select("phone, uid").in_("phone", phones).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="No users found")
        return [{"phone": user["phone"], "uid": user["uid"]} for user in response.data]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")
