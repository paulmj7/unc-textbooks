const express = require('express');
const mongoose = require('mongoose');
let User = require('./models/user');

const app = express();
const port = 3000;
const { check, validationResult } = require('express-validator');

app.use(express.urlencoded({ extended: true }));
app.use(express.static('views'));

mongoose.connect('mongodb://localhost/TextbookDB');

let db = mongoose.connection;
db.once('open', function() {
    console.log('Connected to mongodb');
});
db.on('error', function(err) {
    console.log(err);
});


app.set('view engine', 'pug');

app.get('/', (req, res) => res.render('index.pug', { title: 'Home' }));
app.get('/about', (req, res) => res.render('about.pug', { title: 'About Us' }));
app.get('/search_by_class', (req, res) => res.render('search_by_class.pug', { title: 'Textbooks' }));
app.get('/register', (req, res) => res.render('register.pug', { title: 'Register' }));
app.get('/login', (req, res) => res.render('login.pug', { title: 'Login' }));

app.post('/register', [check('email').isEmail(), check('password').isLength({ min: 8 })], (req, res) => {
    let user = new User();
    console.log(req.body);
    user.first = req.body.first;
    user.last = req.body.last;
    user.email = req.body.email;
    user.password = req.body.password;
    user.save(function(err) {
        if(err) {
            console.log(err);
            return;
        } else {
            res.redirect('/');
        }
    });
});

app.post('/login', [check('email').isEmail(), check('password').isLength({ min: 8 })], (req, res) => {
    let user = new User();
    console.log(req.body);
    user.email = req.body.email;
    user.password = req.body.password;
});

app.listen(port, () => console.log(`Listening on port ${port}...`));

app.use(function (req, res, next) {
    res.status(404).render('404.pug', { title: 'Home'});
});