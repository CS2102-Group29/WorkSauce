# WorkSauce

## Welcome to WorkSauce!

WorkSauce is a platform that connects taskees and taskers. Upon signing up for a new account, 
a normal user can either submit tasks or pick tasks. Tasks are general chores such as:
* washing a car on Kent Vale’s car park on Sunday starting at 4:00 pm
* delivering a parcel on Tuesday between 17:00 and 19:00. 

A user who wants to pick a task can bid the **hourly rate (in USD)** that he is willing to 
accept for that particular task. The user who submits that task will have to choose the 
successful bidder before the stipulated expiry date (specified during task submission).

There are two types of account, namely the normal user account and the administrator account. 
Besides all the functionalities available to the normal users, administrators can create, 
modify and delete all entries. To create an administrator account, please refer to 
[Creating an Administrator Account](#Creating-an-Administrator-Account)

## Creating an Administrator Account

To create an administrator account, navigate to the sign up page and fill in the form as per 
normal user sign up. Fill in the optional admin passcode field. The admin passcode is set to 
'I am an admin'. An administartor can subsequently sign in to his/her account like a normal 
user while retaining all the administrators' privileges. Below is the screenshot on the sign
up page.

<p align="center">
  <img width="800" src="https://github.com/CS2102-Group29/WorkSauce/tree/master/screenshots/Admin_Passcode.png">
</p>

## [Schemas](data/schema.sql)

1. users (entity)
```sql
CREATE TABLE users (
    email VARCHAR(256) PRIMARY KEY,
    password VARCHAR(256) NOT NULL,
    name VARCHAR(256) NOT NULL,
    mobile VARCHAR(256) NOT NULL,
    image TEXT NOT NULL DEFAULT 'https://i.stack.imgur.com/34AD2.jpg',
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
    end_time TIME NOT NULL CHECK(end_time > time),
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
    FOREIGN KEY (task_id) REFERENCES tasks (id) ON DELETE CASCADE,
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
