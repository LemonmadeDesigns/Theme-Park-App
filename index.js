const express = require('express');
const app = express();

const PORT = 3000;
const classRouter = require('./routes/classRouter')
const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/grades');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views');


app.use('/', classRouter)
// Have Express serve public folder - css, js, images
app.use(express.static('public'))

app.listen(PORT, () => {
    console.log('Server is running on port ', PORT)
})



