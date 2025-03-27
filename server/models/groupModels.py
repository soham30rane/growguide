from pydantic import BaseModel
from typing import List

class createGroupReqMod(BaseModel):
    groupname: str
    uids: List[str]

class createGroupResMod(BaseModel):
    error:bool
    message:str
    groupid:str
    roomid:str