const dbClient = require('../app').dbClient;

const { Router } = require('express');
const router = Router();

// list all tasks
router.get('/', (req, res) => {
    res.header({ 'Access-Control-Allow-Origin': '*' });

    let query = 'SELECT * FROM tasks';

    if (req.query.email) {
        query += ` WHERE taskee_email = '${req.query.email}'`
    }

    dbClient.query(query)
        .then(dbres => res.json({ success: true, data: dbres.rows }))
        .catch(err => res.json({ success: false, err: err }));
});

// get a single task based on id
router.get('/:id', (req, res) => {
    res.header({ 'Access-Control-Allow-Origin': '*' });

    dbClient.query(`SELECT * FROM tasks WHERE id = ${req.params.id}`)
        .then(dbres => res.json({ success: true, data: dbres.rows[0] }))
        .catch(err => res.json({ success: false, err: err }));
});

// create task
router.post('/new', (req, res) => {
    const title = req.body.title;
    const description = req.body.description;
    const date = req.body.date;
    const time = req.body.time;
    const end_time = req.body.end_time;
    const location = req.body.location;
    const taskee_email = req.body.taskee_email;
    const expiry_date = req.body.expiry_date;

    res.header({ 'Access-Control-Allow-Origin': '*' });

    var currentMaxId = 0;

    dbClient.query('SELECT MAX(id) FROM tasks').then(idres => {
        currentMaxId = idres.rows[0].max;

        const id = req.body.task_id == 'undefined' ? req.body.task_id : currentMaxId + 1;

        dbClient.query(`INSERT INTO tasks
                        VALUES (
                            ${id}, '${title}', '${description}', '${date}',
                            '${time}', ${end_time !== '' ? "'" + end_time + "'" : 'NULL'}, 
                            '${location}', '${taskee_email}', '${expiry_date}')
                        ON CONFLICT (id) DO UPDATE
                        SET title = EXCLUDED.title,
                            description = EXCLUDED.description,
                            date = EXCLUDED.date,
                            time = EXCLUDED.time,
                            end_time = EXCLUDED.end_time,
                            location = EXCLUDED.location,
                            taskee_email = EXCLUDED.taskee_email,
                            expiry_date = EXCLUDED.expiry_date`)
                .then(dbres => res.json({ success: true, data: req.body }))
            .catch((err) => {
                let msg;

                if (err.constraint === 'tasks_check') {
                    msg = 'Please ensure end time is not before start time.';
                } else if (err.constraint === 'tasks_check1') {
                    msg = 'Please ensure expiry date is not after task date.';
                }

                res.json({ success: false, err: err, msg: msg})
            });
    });
});

// delete task
router.post('/delete/:id', (req, res) => {
    const id = req.params.id;

    res.header({ 'Access-Control-Allow-Origin': '*' });

    dbClient.query(`DELETE FROM tasks WHERE id = ${id}`, (err, dbres) => {
      if(err) {
        res.json({ success: false, err: err });
      } else {
        res.json({ success: true });
      }
    });  
});

module.exports = router;
