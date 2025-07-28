CREATE TABLE users (
    username VARCHAR(255) PRIMARY KEY,
    password VARCHAR(255)
);

CREATE TABLE tasks (
    task_id SERIAL PRIMARY KEY,
    creator_username VARCHAR(255),
    assigned_to VARCHAR(255),
    title VARCHAR(255),
    description TEXT,
    priority VARCHAR(255),
    status VARCHAR(355),
    FOREIGN KEY (creator_username) REFERENCES users(username),
    FOREIGN KEY (assigned_to) REFERENCES users(username)
);
