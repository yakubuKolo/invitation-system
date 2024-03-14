const express = require('express');
const exphbs  = require('express-handlebars');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const session = require("express-session");

require('dotenv').config();

const app = express();
const port = process.env.PORT || 8082;

// Parsing middleware
//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

//parse application Json
app.use(bodyParser.json());

app.use(session({
    secret:'yakubusafodeaddev536612',
    resave: true,
    saveUninitialized: true
}))

//static files
app.use(express.static('public'));

// Templating engines
app.engine('hbs', exphbs.engine( {extname: '.hbs'}));
app.set ('view engine', 'hbs');


//connection pool
const pool = mysql.createPool({
     connectionLimit : 100,
     host : process.env.DB_HOST,
     user  : process.env.DB_USER,
     password : process.env.DB_PASS,
     database : process.env.DB_NAME


});

// connect to db
pool.getConnection((err, connection) => {
    if(err)throw err; //not connected
    console.log('connected as ID' + connection.threadId);
});









const routes = require('./server/routes/user');
app.use('/', routes);

app.listen(port, () => console.log(`listening on port ${port}`));