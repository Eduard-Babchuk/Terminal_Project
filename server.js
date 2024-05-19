const express = require('express')
const { Client } = require('pg')
const dotenv = require('dotenv')

dotenv.config()

const app = express()
const port = 8000

const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
})

app.use(express.static('public'))
app.use(express.json())

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/RollDice.html')
})

app.post('/', (req, res) => {
    const data = req.body
    insertDiceRolls(data)
    res.send('Dice rolls data received and processed')
})

app.get('/dice_rolls', async (req, res) => {
    try {
        const queryResult = await client.query('SELECT * FROM dice_rolls')
        res.json(queryResult.rows)
    } catch (error) {
        console.error('Error fetching dice rolls data:', error.message)
        res.status(500).json({ error: 'An error occurred while fetching dice rolls data' })
    }
})

connectToDatabase()

async function connectToDatabase() {
    try {
        await client.connect()
        console.log('Connected to the database')
        await checkIfTableExists()
    } catch (error) {
        console.error('Error connecting to the database:', error.message)
    }
}

async function checkIfTableExists() {
    try {
        const result = await client.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_name = 'dice_rolls'
            )
        `)
        const tableExists = result.rows[0].exists
        if (tableExists) {
            console.log('Dice rolls table already exists')
            app.listen(port, () => {
                console.log(`Server is running on http://Localhost:${port}`)
            })
        } else {
            console.log('Dice rolls table does not exist, creating...')
            await createDiceRollsTable()
        }
    } catch (error) {
        console.error('Error checking if dice rolls table exists:', error.message)
    }
}

async function createDiceRollsTable() {
    try {
        await client.query(`
            CREATE TABLE IF NOT EXISTS dice_rolls (
                id SERIAL PRIMARY KEY,
                roll_date VARCHAR(255),
                dice1 VARCHAR(255) DEFAULT NULL,
                res1 VARCHAR(255) DEFAULT NULL,
                dice2 VARCHAR(255) DEFAULT NULL,
                res2 VARCHAR(255) DEFAULT NULL,
                dice3 VARCHAR(255) DEFAULT NULL,
                res3 VARCHAR(255) DEFAULT NULL,
                dice4 VARCHAR(255) DEFAULT NULL,
                res4 VARCHAR(255) DEFAULT NULL,
                dice5 VARCHAR(255) DEFAULT NULL,
                res5 VARCHAR(255) DEFAULT NULL,
                dice6 VARCHAR(255) DEFAULT NULL,
                res6 VARCHAR(255) DEFAULT NULL,
                dice7 VARCHAR(255) DEFAULT NULL,
                res7 VARCHAR(255) DEFAULT NULL,
                dice8 VARCHAR(255) DEFAULT NULL,
                res8 VARCHAR(255) DEFAULT NULL,
                dice9 VARCHAR(255) DEFAULT NULL,
                res9 VARCHAR(255) DEFAULT NULL,
                dice10 VARCHAR(255) DEFAULT NULL,
                res10 VARCHAR(255) DEFAULT NULL
            )
        `)
        console.log('Dice rolls table created successfully')
        checkIfTableExists()
    } catch (error) {
        console.error('Error creating dice rolls table:', error.message)
    }
}

async function insertDiceRolls(data) {
    try {
        const { roll_date, ...diceResults } = data
        const columns = Object.keys(diceResults).join(', ')
        const values = Object.values(diceResults)
        await client.query(`
            INSERT INTO dice_rolls (roll_date, ${columns})
            VALUES ($1, ${values.map((_, index) => `$${index + 2}`).join(', ')})
        `, [roll_date, ...values])
        console.log('Dice rolls data inserted successfully')
    } catch (error) {
        console.error('Error inserting dice rolls data:', error.message)
    }
}