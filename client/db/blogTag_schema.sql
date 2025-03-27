CREATE TABLE blogTag (
    blogid UUID NOT NULL,
    tag TEXT NOT NULL,
    FOREIGN KEY (blogid) REFERENCES blog(blogid) ON DELETE CASCADE
);
