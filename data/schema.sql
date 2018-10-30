CREATE TABLE users (
    email VARCHAR(256) PRIMARY KEY,
    password VARCHAR(256) NOT NULL,
    name VARCHAR(256) NOT NULL,
    mobile VARCHAR(256) NOT NULL,
    image VARCHAR(256)
);

CREATE TABLE tasks (
    id INTEGER PRIMARY KEY,
    title VARCHAR(256) NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    time TIME NOT NULL,
    location VARCHAR(256) NOT NULL,
    taskee_email VARCHAR(256) NOT NULL,
    expiry_date DATE NOT NULL CHECK(expiry_date <= date),
    FOREIGN KEY (taskee_email) REFERENCES users (email) ON UPDATE CASCADE
);

CREATE TYPE bid_status AS ENUM ('success', 'ongoing', 'fail');

CREATE TABLE bid_task (
    task_id INTEGER NOT NULL,
    bidder_email VARCHAR(256) NOT NULL,
    bid NUMERIC NOT NULL,
    status bid_status NOT NULL,
    PRIMARY KEY (task_id, bidder_email),
    FOREIGN KEY (task_id) REFERENCES tasks (id),
    FOREIGN KEY (bidder_email) REFERENCES users (email) ON UPDATE CASCADE
);

\copy users from '/docker-entrypoint-initdb.d/users.csv' csv
\copy tasks from '/docker-entrypoint-initdb.d/tasks.csv' csv
\copy bid_task from '/docker-entrypoint-initdb.d/bid_task.csv' csv
