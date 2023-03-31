// const { json } = require('express')
const express=require('express')
const app=express()
require('dotenv').config()
const moongose=require('mongoose')
const authRoutes=require('./src/routes/authRoute')

const PORT=process.env.PORT
const MONGO_URL=process.env.MONGO_URL
const cors=require('cors')

app.use(cors())

moongose.connect(MONGO_URL).then(console.log("database is connect"))

app.use(express.json())

app.use('/api/auth',authRoutes)

app.listen(PORT,()=>{
    console.log(`backend is running on port : ${PORT}`)
})
