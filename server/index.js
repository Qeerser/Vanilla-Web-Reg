require('dotenv').config();  // เพิ่มบรรทัดนี้เพื่อใช้ dotenv

const express = require("express");
const bodyparser = require('body-parser')
const cors = require('cors')
const app = express()

const { Pool } = require('pg');

const port = 8000   // ใช้ PORT จาก .env หรือค่า default 8000

app.use(bodyparser.json())
app.use(cors())

let pool = null

const initDB =  () => {
  pool =  new Pool({
    user: process.env.DB_USER,        // ดึงค่าจากไฟล์ .env
    host: process.env.DB_HOST,        // ดึงค่าจากไฟล์ .env
    database: process.env.DB_NAME,    // ดึงค่าจากไฟล์ .env
    password: process.env.DB_PASSWORD,// ดึงค่าจากไฟล์ .env
    port: process.env.DB_PORT, // ดึงค่าจากไฟล์ .env
    // ssl: {
    //   rejectUnauthorized: false
    // }
  });
}

app.get('/albums', async (req, res) => {
  try {
    const query = 'SELECT * FROM albums;';
    const { rows } = await pool.query(query);
    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('failed');
  }
});

//path Get /users
app.get('/users', async (req, res) => {
  const query = 'SELECT * FROM users;';
  const { rows } = await pool.query(query);
  res.status(200).json(rows);
})

//path = Post /users
app.post('/users', async (req, res) => {
  try {
    const data = req.body;

    const keys = Object.keys(data).join(', ');
    const values = Object.values(data);
    const placeholders = values.map((i) => `'${i}'`).join(', ');

    const query = `INSERT INTO users (${keys}) VALUES (${placeholders})`;
    const { rows } = await pool.query(query)
    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('failed');
  }
})

app.get('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const query = 'SELECT * FROM users WHERE id = $1;';
    const { rows } = await pool.query(query, [id]);

    if (rows.length === 0) {
      return res.status(404).send('this users is not in the database');
    }

    res.status(200).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('failed');
  }
})

app.put('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const keys = Object.keys(data);
    const [firstname, lastname, age, gender, interests, description] = Object.values(data);
    const setClause = keys.map((key, index) => `${key} = $${index + 1}`).join(', ');

    const query = `UPDATE users SET ${setClause} WHERE id = $${keys.length + 1} RETURNING *;`;
    const { rows } = await pool.query(query, [firstname, lastname, age, gender, interests, description, id]);

    if (rows.length === 0) {
      return res.status(404).send('Cannot find anything');
    }

    res.status(200).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Some error has occurred');
  }
})

app.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const query = 'DELETE FROM users WHERE id = $1 RETURNING *;';
    const { rows } = await pool.query(query, [id]);

    if (rows.length === 0) {
      return res.status(404).send('we have not found the album');
    }

    res.status(200).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('some error has occurred');
  }
})

app.listen(port, async () => {
  initDB();
  console.log('HTTP server running at port ' + port);
});