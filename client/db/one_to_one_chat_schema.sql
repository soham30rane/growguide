CREATE TABLE one_to_one_chat (
    uid1 UUID NOT NULL,
    uid2 UUID NOT NULL,
    PRIMARY KEY (uid1, uid2),
    FOREIGN KEY (uid1) REFERENCES users(uid) ON DELETE CASCADE,
    FOREIGN KEY (uid2) REFERENCES users(uid) ON DELETE CASCADE
);
