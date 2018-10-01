# task_sourcing

## Shcemas

1. users (entity)
```sql
CREATE TABLE users (
	email VARCHAR(256) PRIMARY KEY,
	password VARCHAR(256) NOT NULL,
	name VARCHAR(256) NOT NULL,
	mobile VARCHAR(256) NOT NULL,
	image_url VARCHAR(256) NOT NULL
	);
```

2. tasks (entity)
```sql
CREATE TABLE tasks (
	id SERIAL PRIMARY KEY,
	title VARCHAR(256) NOT NULL,
	description TEXT,
	date DATE NOT NULL,
        time TIME NOT NULL,
	location VARCHAR(256) NOT NULL,
	taskee_email VARCHAR(256) NOT NULL,
	expiry_date DATE NOT NULL,
	FOREIGN KEY (taskee_email) REFERENCES users (email)
	);
```

3. bid_task (relationship)
```sql
CREATE TABLE bid_task (
	task_id INTEGER NOT NULL,
	bidder_email VARCHAR(20) NOT NULL,
	bid NUMERIC NOT NULL,
	is_taken BOOLEAN NOT NULL,
	FOREIGN KEY (task_id) REFERENCES tasks (id),
	FOREIGN KEY (bidder_email) REFERENCES users (email),
	PRIMARY KEY (task_id, bidder_email)
	);
```
