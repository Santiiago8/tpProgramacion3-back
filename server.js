const express = require('express')
const { config } = require('dotenv')
const cors = require('cors')
const { Pool } = require('pg')

config()
const app = express()
const port = 3000

app.use(cors())
app.use(express.json())

//Conexion con porstgreSQL
const pool = new Pool({
    user: process.env.USER,
    host: process.env.HOST,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: process.env.PORT
})

//Ruta para consultar notas por alumno
app.get('/notas/alumno/:nombre', async (req, res) => {
    const { nombre } = req.params
    try {
        const result = await pool.query(
            `SELECT a.nombre, m.materia, n.nota
             FROM notas n
             JOIN alumnos a ON n.idalumno = a.id
             JOIN materias m ON n.idmateria = m.id
             WHERE a.nombre = $1`,
             [nombre]
        )
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al consultar las notas');
    }
})


//Ruta para consultar notas por materias
app.get('/notas/materia/:materia', async (req, res) => {
    const { materia } = req.params
    try {
        const result = await pool.query(
            `SELECT a.nombre, m.materia, n.nota
             FROM notas n
             JOIN alumnos a ON n.idalumno = a.id
             JOIN materias m ON n.idmateria = m.id
             WHERE m.materia = $1`,
             [materia]
        )
        res.json(result.rows)
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al consultar las notas')
    }
})

//Ruta para agregar un alumno
app.post('/alumnos', async (req, res) => {
    const { nombre, dni, mail } = req.body
    try {
        await pool.query(
            `INSERT INTO alumnos (nombre, dni, mail) VALUES ($1, $2, $3)`,
            [nombre, dni, mail]
        )
        res.json({message: 'Alumno agregado con exito'})
    } catch (err) {
        console.error(err)
        res.status(500).send('Error al agregar el alumno')
    }
})

// Ruta para agregar una materia
app.post('/materias', async (req, res) => {
    const { materia, anio } = req.body
    try {
        await pool.query(
            `INSERT INTO materias (materia, anio) VALUES ($1, $2)`,
            [materia, anio]
        )
        res.json({ message: 'Materia agregada exitosamente' })
    } catch (err) {
        console.error(err)
        res.status(500).send('Error al agregar la materia')
    }
})

app.listen(port, () => {
    console.log(`Server listen on http://localhost:${port}`)
})