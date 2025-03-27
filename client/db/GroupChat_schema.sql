CREATE TABLE GroupChat (
    groupid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    groupName TEXT NOT NULL,
    roomid UUID UNIQUE
);
