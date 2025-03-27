CREATE TABLE users (
    uid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    userName TEXT NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    address TEXT NOT NULL,
    language_preference TEXT NOT NULL,
    roles TEXT NOT NULL,
    domain TEXT NOT NULL
);
