# task_sourcing
## [Schemas](data/schema.sql)

1. users (entity)
```sql
CREATE TABLE users (
    email VARCHAR(256) PRIMARY KEY,
    password VARCHAR(256) NOT NULL,
    name VARCHAR(256) NOT NULL,
    mobile VARCHAR(256) NOT NULL,
    image TEXT,
    is_admin BOOLEAN NOT NULL DEFAULT false
);
```

2. tasks (entity)
```sql
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
```

3. bid_task (relationship)
```sql
CREATE TYPE bid_status AS ENUM ('success', 'ongoing', 'fail');

CREATE TABLE bid_task (
    task_id INTEGER NOT NULL,
    bidder_email VARCHAR(256) NOT NULL,
    bid NUMERIC NOT NULL,
    status bid_status NOT NULL,
    FOREIGN KEY (task_id) REFERENCES tasks (id),
    FOREIGN KEY (bidder_email) REFERENCES users (email) ON UPDATE CASCADE,
    PRIMARY KEY (task_id, bidder_email)
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
```
