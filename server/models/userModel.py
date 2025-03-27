from pydantic import BaseModel

class registerReqMod(BaseModel):
    phone:str
    password:str
    username:str
    latitude:float
    longitude:float
    address:str
    language_preference:str
    description:str
    roles:str

class loginReqMod(BaseModel):
    phone:str
    password:str


class userResMod(BaseModel):
    error:bool
    token:str
    username:str
    latitude:float
    longitude:float
    address:str
    language_preference:str
    description:str
    roles:str
