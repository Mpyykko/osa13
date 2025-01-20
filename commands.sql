CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author TEXT NOT NULL,
    url TEXT NOT NULL,
    title TEXT NOT NULL,
    likes INTEGER DEFAULT 0
);

INSERT INTO blogs (author, url, title, likes)
VALUES
    ('M.P', 'http://www.fi', 'Mikon eka blogi', 1),
    ('M.P', 'http://www.fi', 'Mikon toka blogi', 3);

\q
exit