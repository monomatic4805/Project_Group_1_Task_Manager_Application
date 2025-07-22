CREATE TABLE users (
    username VARCHAR(255) PRIMARY KEY,
    password VARCHAR(255)
);

CREATE TABLE tasks (
    task_id SERIAL PRIMARY KEY,
    creator_username VARCHAR(255),
    title VARCHAR(255),
    content TEXT,
    FOREIGN KEY (creator_username) REFERENCES users(username)
);
