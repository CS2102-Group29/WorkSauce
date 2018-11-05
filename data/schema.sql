CREATE TABLE users (
    email VARCHAR(256) PRIMARY KEY,
    password VARCHAR(256) NOT NULL,
    name VARCHAR(256) NOT NULL,
    mobile VARCHAR(256) NOT NULL,
    image TEXT,
    admin_passcode BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE tasks (
    id INTEGER PRIMARY KEY,
    title VARCHAR(256) NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    time TIME NOT NULL,
    end_time TIME CHECK(time < end_time),
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

CREATE FUNCTION change_everything_to_fail()
RETURNS TRIGGER AS $$
BEGIN
UPDATE bid_task SET status = 'fail'
WHERE bidder_email <> NEW.bidder_email AND task_id = NEW.task_id;
RETURN NEW;
END; $$
LANGUAGE PLPGSQL;

CREATE TRIGGER success_integrity
AFTER INSERT OR UPDATE
ON bid_task
FOR EACH ROW
WHEN (NEW.status = 'success')
EXECUTE PROCEDURE change_everything_to_fail();

\copy users from '/docker-entrypoint-initdb.d/users.csv' csv
\copy tasks from '/docker-entrypoint-initdb.d/tasks.csv' csv
\copy bid_task from '/docker-entrypoint-initdb.d/bid_task.csv' csv
