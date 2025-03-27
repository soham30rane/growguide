from pydantic import BaseModel

class registerReqMod(BaseModel):
    phone:str
    password:str
    username:str
    latitude:str
    longitude:str
    address:str
    language_preference:str
    domain:str
    roles:str

class loginReqMod(BaseModel):
    phone:str
    password:str


class userResMod(BaseModel):
    error:bool
    token:str
    username:str
    latitude:str
    longitude:str
    address:str
    language_preference:str
    domain:str
    roles:str
