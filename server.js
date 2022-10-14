const express = require('express');
const app = express();

const PORT = 3000;
const rideRouter = require('./routes/rideRouter')
const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/rides');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views');


app.use('/', rideRouter)

// Have Express serve public folder - css, js, images
app.use(express.static('public'))

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})



