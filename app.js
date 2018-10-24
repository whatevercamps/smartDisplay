const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const multer = require('multer');
const config = require('./config/database');



//Connect to database
mongoose.connect(config.database);

//On connected
mongoose.connection.on('connected', () => {
	console.log('Connected to database ' + config.database);
});

//On error
mongoose.connection.on('error', (err) => {
	console.log('Database error ' + err);
});

const app = express();

const users = require('./routes/users');

//PORT NUMBER
const port = 3000;

//CORS
app.use(cors());


//STATIC FOLDER
app.use(express.static(path.join(__dirname, 'public')));


//BODY-PARSER
app.use(bodyParser.json());

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);


app.use('/users', users);

//INDEX ROUTE
app.get('/hola', (req, res) => {
	res.send('Hola :3');
});

app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, 'public/index.html'));
  });


//START SERVER
app.listen(port, () => {
	console.log('Server started on port ' + port);
});

