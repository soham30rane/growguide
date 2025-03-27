CREATE TABLE blog (
    blogid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    uid UUID NOT NULL,
    blog_title TEXT,
    blog_content TEXT,
    FOREIGN KEY (uid) REFERENCES users(uid) ON DELETE CASCADE
);

ALTER TABLE blog 
ADD COLUMN created_on TIMESTAMP DEFAULT NOW();
