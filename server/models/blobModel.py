from pydantic import BaseModel
from typing import List
from datetime import datetime

class blogReqMod(BaseModel):
    uid: str
    blogTitle: str
    blogContent: str
    tags: List[str]

class blogResMod(BaseModel):
    error: bool

class BlogDetail(BaseModel):
    blogid: str
    uid: str
    blog_title: str
    blog_content: str
    created_on: datetime
    tags: List[str]

class getBlogsResMod(BaseModel):
    blogs: List[BlogDetail]