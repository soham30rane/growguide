CREATE TABLE blogTag (
    blogid UUID NOT NULL,
    tag TEXT NOT NULL,
    FOREIGN KEY (blogid) REFERENCES blog(blogid) ON DELETE CASCADE
);

ALTER TABLE blogTag 
ADD CONSTRAINT blogTag_pkey PRIMARY KEY (blogid, tag);
