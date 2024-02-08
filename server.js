const express = require('express')
const mysql = require('mysql')
const dotenv = require('dotenv')

dotenv.config()

const PORT = process.env.PORT || 3000;


const db = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
})

module.exports = db;


db.connect((err) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
    } else {
        console.log('Conexión exitosa a la base de datos MySQL');
    }
})

const app = express()
const todoRoutes = require('./todos/routes')

app.use(express.json())
app.use('/', todoRoutes)


app.listen(PORT, ()=> {
    console.log(`Node API running on port ${PORT}`)
})