require('dotenv').config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const MONGO_URI = process.env.MONGO_URI
const PORT = 3000
const Fruit = require('./models/fruit')
const methodOverride = require('method-override')
const logger = require('morgan')

//Express
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'))
app.use(logger('tiny'))
app.use('/assets', express.static('public'))

mongoose.connect(MONGO_URI)

mongoose.connection.once('open', () => {
    console.log('MongoDB working')
})

mongoose.connection.on('error', () => {
    console.error('MongoDB trippin')
})

// Controller & router logic

//Create - POST request
app.post('/fruits', async (req, res) => {
    req.body.isRead === 'on' || req.body.isRead === true? 
    req.body.isRead = true : 
    req.body.isRead = false
    try {
        const createdFruit = await Fruit.create(req.body)
        res.redirect(`/fruits/${createdFruit._id}`)
    } catch (error) {
        res.status(400).json({ msg: error.message })
    }
})

//Create - Form
app.get('/fruits/new', (req, res) => {
    res.render('new.ejs')
})

//Read - Index
app.get('/fruits', async(req, res) => {
    try {
        const foundFruits = await Fruit.find({})
        res.render('index.ejs', {
            fruits: foundFruits
        })
    } catch (error) {
        res.status(400).json({ msg: error.message })
    }
})

//Read - Show
app.get('/fruits/:id', async (req, res) => {
    try {
        const foundFruit = await Fruit.findOne({ _id: req.params.id })
        res.render('show.ejs', {
            fruit: foundFruit
        })
    } catch (error) {
        res.status(400).json({ msg: error.message })
    }
})

//Update - PUT Request
app.put('/fruits/:id', async (req, res) => {
    req.body.isRead === 'on' || req.body.isRead === true? 
    req.body.isRead = true : 
    req.body.isRead = false
    try {
        const updatedFruit = await Fruit.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
        res.redirect(`/fruits/${updatedFruit._id}`)
    } catch (error) {
        res.status(400).json({ msg: error.message })
    }
})

//Update - Form
app.get('/fruits/:id/edit', async (req, res) => {
    try {
        const foundFruit = await Fruit.findOne({ _id: req.params.id })
        res.render('edit.ejs', {
            fruit: foundFruit
        })
    } catch (error) {
        res.status(400).json({ msg: error.message }) 
    }
})

//Delete
app.delete('/fruits/:id', async (req, res) => {
    try {
        await Fruit.findOneAndDelete({ _id: req.params.id })
        .then((fruit) => {
           res.redirect('/fruits')
        })
    } catch (error) {
        res.status(400).json({ msg: error.message })
    }
})

app.listen(PORT, () => {
    console.log(`The application is accepting requests on PORT ${PORT}`)
})