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
[Creating an Administrator Account](#Creating-an-Administrator-Account) section.

## Getting Started Guide

The following are the breakdown of the pages in WorkSauce web application to help you navigate
through the application easily.

<details>
<summary><b>Sign Up</b></summary>
<br>
<p align="center">
  <img width="400" src="https://github.com/CS2102-Group29/WorkSauce/blob/master/screenshots/Sign_Up.png">
</p>
To sign up, simply fill in all the details required (shown in the figure above). The admin
passcode field can be left blank. It should only be filled in when creating an administrator 
accoun. There will be an alert message if you are trying to sign up using an already existing 
email address.
<br>
</details>

<details>
<summary><b>Log In</b></summary>
<br>
<p align="center">
  <img width="400" src="https://github.com/CS2102-Group29/WorkSauce/blob/master/screenshots/Log_In.png">
</p>
To log in, fill in the email and password field shown above.
<br>
</details>

<details>
<summary><b>Home</b></summary>
<br>
<p align="center">
  <img width="400" src="https://github.com/CS2102-Group29/WorkSauce/blob/master/screenshots/Home.png">
</p>
The home page shows all the tasks submitted by all the users. You can filter the tasks by using
the search bar on the top left hand corner of the screen.

Click on the name of the taskee to see his/her profile.

Click on the task title (the one following `Need help with`) to see the task details and bid
for the task.

Note that you will be able to see all the tasks you have submitted, but you will not be able 
to bid for those tasks.
<br>
</details>

<details>
<summary><b>Tasks Created</b></summary>
<br>
<p align="center">
  <img width="400" src="https://github.com/CS2102-Group29/WorkSauce/blob/master/screenshots/Tasks_Created.png">
</p>

You will be able to see all the tasks you have submitted here. You can click on the `Edit` and 
`Delete` buttons to edit and delete the task respectively. Note that you will not be able to
edit or delete tasks that have passed.

You will also be able to see all the bidders who are interested in the tasks. You can choose a
successful bidder by using the toggle button beside the name of the bidder, and click accept.
<br>
</details>

<details>
<summary><b>Upcoming Tasks</b></summary>
<br>
<p align="center">
  <img width="400" src="https://github.com/CS2102-Group29/WorkSauce/blob/master/screenshots/Upcoming_Tasks.png">
</p>

This is where you can see all the tasks you have successfully bidded and have yet to complete.
<br>
</details>

<details>
<summary><b>Bidding Manager</b></summary>
<br>
<p align="center">
  <img width="400" src="https://github.com/CS2102-Group29/WorkSauce/blob/master/screenshots/Bidding_Manager.png">
</p>

Bidding Manager collates all your bids in one place, whether they are successful, unsuccessful,
or still ongoing. 

For the ongoing bids, you can easily modify your bids from this page. You can
also see the lowest bid for the task so far. Note that the tasker is one who eventually
decides the successful bidder (which may or may not be based on the bids placed).

You can click on the task title or taskee name to see their details.
</details>
 
## Creating an Administrator Account

To create an administrator account:
1. Navigate to the sign up page and fill in the form as per normal user sign up. 
2. Fill in the optional admin passcode field. The admin passcode is set to 'I am an admin'. 

<p align="center">
  <img width="400" src="https://github.com/CS2102-Group29/WorkSauce/blob/master/screenshots/Admin_Passcode.png">
</p>

An administartor can subsequently sign in to his/her account like a normal user while 
retaining all the administrators' privileges. Below is the screenshot on the sign up page.

## Dummy Accounts

We have created 20 normal user accounts and 2 administrator accounts for you to try out.
To sign in as a normal user, key in `testX@example.com` and `testY` for the email and
password fields respectively.  To sign in as an administrator, key in `adminZ@example.com` and
`adminW` for the email and password fields respectively.

* X is a number from 1 to 20 inclusive
* Y is a number from 01 to 20 inclusive (at least 2 character long)
* Z is a number from 1 to 2 inclusive
* W is a number from 01 to 02 inclusive (at least 2 character long)

For example:

* email : `admin1@example.com` ; password : `admin01`
* email : `test3@example.com` ; password : `test03`
* email : `test15@example.com` ; password : `test15`

## Tech Stack

* DBMS: PostgreSQL
* Database Server: Node.js
* Client-side languages: HTML, CSS, Javascript
* Server-side languages: -

## [Database Schemas](data/schema.sql)

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

## Entity-Relationship Diagram

<p align="center">
  <img width="800" src="https://github.com/CS2102-Group29/WorkSauce/blob/master/screenshots/ER_Diagram.png">
</p>
