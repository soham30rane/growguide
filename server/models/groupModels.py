from pydantic import BaseModel
from typing import List

class createGroupReqMod(BaseModel):
    groupname: str
    uids: List[str]

class createGroupResMod(BaseModel):
    error: bool
    message: str
    groupid: str
    roomid: str

class getGroupReqMod(BaseModel):
    uid: str

class RoomInfo(BaseModel):
    groupid: str
    groupname: str
    roomid: str

class getGroupResMod(BaseModel):
    error: bool
    groups: List[RoomInfo]