const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mysql = require("mysql");



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


exports.logPage = (req, res) => {
    res.render("login")
}


exports.loginuser = async (req, res) => {
 const {email, password} = req.body;
if(!email || !password){
    res.render("login", {alert:"insert email and password"});

}
else{
    pool.getConnection((err, connection) => {
        if(err)throw err; //not connected
        console.log('connected as ID' + connection.threadId);

        //user connection
        connection.query('SELECT * from users where email = ?', [email], async (err, rows) => {
            //When done with the connection, release it
            connection.release();

            if (err){
                console.log(err);
                 throw err;
            }
            else if(!rows[0] || !await bcrypt.compare(password, rows[0].password)){
                res.render("login", {alert:"Incorrect Email or Password"});
            }
            else{
                                const id = rows[0].user_id;

               const token = jwt.sign({id}, process.env.JWT_SECRET, {
                   expiresIn: process.env.JWT_EXPIRES   
               });

               const cookieOptions = {
                   expiresIn:new Date(Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
                   httpOnly: true
               }
               res.cookie(token, cookieOptions);
               res.status(200).redirect("/user/events/" + id);
            }
            


        });

     });
    }

};