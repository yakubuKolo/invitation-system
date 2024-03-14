const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mysql = require("mysql");
const {promisify} = require("util");
const e = require("express");



const pool = mysql.createPool({
    connectionLimit : 100,
    host : process.env.DB_HOST,
    user  : process.env.DB_USER,
    password : process.env.DB_PASS,
    database : process.env.DB_NAME,
    secret : process.env.JWT_SECRET,
    jwtexp : process.env.JWT_EXPIRES,
    cookiexp : process.env.COOKIE_EXPIRES
});

exports.eventss =  (req, res, next) => {
    pool.getConnection((err, connection) => {
        if(err)throw err; //not connected
        console.log('connected as ID' + connection.threadId);
    
        //user connection
        
        connection.query('       select * from e_v_e_n_t_s right join users on e_v_e_n_t_s.user_id = users.user_id where users.user_id = ?  order by registeration_date desc     ', [req.params.id], (err, rows) => {
            //When done with the connection, release it
            connection.release();
    
            if(err){
                console.log(err);
            }
            
           else if(!rows[0]){
                res.status(404).render('404');
                
            }else if(rows[0] && rows[0].event_id === null){
                res.render('eventoptions', {rows, alert:`You do not have any event registered`});
            }
            else{
                res.render('events', {rows, alert:`please do not send the links to your pages to just anyone`});
            }
            console.log('the data from user table: \n', rows);
    
    
    
        });
    
     });
};

exports.evo =  (req, res, next) => {
    pool.getConnection((err, connection) => {
        if(err)throw err; //not connected
        console.log('connected as ID' + connection.threadId);
    
        //guest connection
    
        connection.query('select * from users WHERE user_id  = ?', [req.params.id], (err, rows) => {
            //When done with the connection, release it
            connection.release();
      
            if(!err){
                res.render('eventoptions', {rows, alert:`please do not send the links to your pages to just anyone`});
            }else if(!rows[0]){
                res.status(404).render('404');
            }
            else{
                console.log(err);
            }
            console.log('the data from guest table: \n', rows);
    
    
    
        });
    
     });
}


exports.addevent =  (req, res, next) => {
    const {event_type, event_host, tittle, event_date, time, VENUE } = req.body;

    pool.getConnection((err, connection) => {
        if(err)throw err; //not connected
        console.log('connected as ID' + connection.threadId);

        function getRandomNumber(min, max) {
            return Math.floor(Math.random() * (100000 - 50) + 50);
          }
          
          // Example usage: Generate a random number between 1 and 10
          const randomNum = getRandomNumber(1, 11); // Generates a number from 1 to 10 (inclusive)
          console.log(randomNum);
          function getRandomNumber(min, max) {
            return Math.floor(Math.random() * (100000 - 50) + 50);
          }
          
          // Example usage: Generate a random number between 1 and 10
          const randomNum2 = getRandomNumber(1, 11); // Generates a number from 1 to 10 (inclusive)
          console.log(randomNum);

          // Generate a random alphanumeric string of specified length
function generateRandomAlphanumeric(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }
  
  // Example usage:
  const randomAlphanumeric = generateRandomAlphanumeric(10);
  console.log(randomAlphanumeric); // Output: Random alphanumeric string of length 10
  
          const ev_id =   randomNum + req.params.id + randomNum2 + randomAlphanumeric;
        //user connection
        connection.query('INSERT INTO e_v_e_n_t_s SET user_id = ?, title = ?, event_type = ?, event_host = ?, event_date = ?, event_id = ?, time = ?, venue = ?',[req.params.id, tittle, event_type, event_host, event_date, ev_id, time, VENUE], (err, rows) => {
            //When done with the connection, release it
            connection.release();

            if(!err){
                
                res.redirect('/user/events/' + req.params.id);
            }else{
                console.log(err);
            }
            console.log('the data from user table: \n', rows);



        });

     });

}
 




exports.fest = (req, res) => {
    pool.getConnection((err, connection) => {
        if(err)throw err; //not connected
        console.log('connected as ID' + connection.threadId);
    
        //guest connection
    
        connection.query('select * from users WHERE user_id  = ?', [req.params.id], (err, rows) => {
            //When done with the connection, release it
            connection.release();
      
            if(!err){
                res.render('addfest', {rows});
            }else if(!rows[0]){
                res.status(404).render('404');
            }
            else{
                console.log(err);
            }
            console.log('the data from guest table: \n', rows);
    
    
    
        });
    
     });
}



exports.meet = (req, res) => {
    pool.getConnection((err, connection) => {
        if(err)throw err; //not connected
        console.log('connected as ID' + connection.threadId);
    
        //guest connection
    
        connection.query('select * from users WHERE user_id  = ?', [req.params.id], (err, rows) => {
            //When done with the connection, release it
            connection.release();
      
            if(!err){
                res.render('addmeeting', {rows});
            }else if(!rows[0]){
                res.status(404).render('404');
            }
            else{
                console.log(err);
            }
            console.log('the data from guest table: \n', rows);
    
    
    
        });
    
     });
}

exports.other = (req, res) => {
    pool.getConnection((err, connection) => {
        if(err)throw err; //not connected
        console.log('connected as ID' + connection.threadId);
    
        //guest connection
    
        connection.query('select * from users WHERE user_id  = ?', [req.params.id], (err, rows) => {
            //When done with the connection, release it
            connection.release();
      
            if(!err){
                res.render('addother', {rows});
            }else if(!rows[0]){
                res.status(404).render('404');
            }
            else{
                console.log(err);
            }
            console.log('the data from guest table: \n', rows);
    
    
    
        });
    
     });
}

exports.wed = (req, res) => {
    pool.getConnection((err, connection) => {
        if(err)throw err; //not connected
        console.log('connected as ID' + connection.threadId);
    
        //guest connection
    
        connection.query('select * from users WHERE user_id  = ?', [req.params.id], (err, rows) => {
            //When done with the connection, release it
            connection.release();
      
            if(!err){
                res.render('addwedding', {rows});
            }else if(!rows[0]){
                res.status(404).render('404');
            }
            else{
                console.log(err);
            }
            console.log('the data from guest table: \n', rows);
    
    
    
        });
    
     });
}

exports.gtg = (req, res) => {
    pool.getConnection((err, connection) => {
        if(err)throw err; //not connected
        console.log('connected as ID' + connection.threadId);
    
        //guest connection
    
        connection.query('select * from users WHERE user_id  = ?', [req.params.id], (err, rows) => {
            //When done with the connection, release it
            connection.release();
      
            if(!err){
                res.render('addgtg', {rows});
            }else if(!rows[0]){
                res.status(404).render('404');
            }
            else{
                console.log(err);
            }
            console.log('the data from guest table: \n', rows);
    
    
        });
    
     });
}

