from pydantic import BaseModel
from typing import List

class blogReqMod(BaseModel):
    uid: str
    blogTitle: str
    blogContent: str
    tags: List[str]

class blogResMod(BaseModel):
    error: bool