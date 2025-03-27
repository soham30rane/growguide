CREATE TABLE groupChatUsers (
    groupuserid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    groupid UUID NOT NULL,
    uid UUID NOT NULL,
    FOREIGN KEY (groupid) REFERENCES GroupChat(groupid) ON DELETE CASCADE,
    FOREIGN KEY (uid) REFERENCES users(uid) ON DELETE CASCADE
);
