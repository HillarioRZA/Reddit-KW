const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const api = require('./routes/index')
const app = express()
const port = 3000

app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }))

app.use('/api', api)
app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, async () => {
    try{
        await mongoose.connect('mongodb://127.0.0.1:27017/t7_6845')
        console.log('Database connected')
    }
    catch(e){
        console.log('Error database connection \n', e)
    }
    console.log(`listening on port ${port}!`)
})