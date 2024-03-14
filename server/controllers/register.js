const mysql = require('mysql');
const bcrypt = require("bcryptjs"); 


const pool = mysql.createPool({
    connectionLimit : 100,
    host : process.env.DB_HOST,
    user  : process.env.DB_USER,
    password : process.env.DB_PASS,
    database : process.env.DB_NAME
});



exports.reggPage = (req, res) => {
    res.render("register");
}



exports.registerUser = (req, res) => {
    const {email, password} = req.body;
    if(!email || !password){
        console.log("insert email or password")
    }else{
 console.log(email)
    pool.getConnection((err, connection) => {
        if(err)throw err; //not connected
        console.log('connected as ID' + connection.threadId);
    
    
        //user connection
        connection.query('select email from users where email = ?',[email], async (err, rows) => {
            if(!err && rows[0]){
                res.render("register", {alert:"user has already been registered"});
            }else{   
                const dbpassword = await bcrypt.hash(password, 10);
                console.log(dbpassword);

                function getRandomNumber(min, max) {
                    return Math.floor(Math.random() * (171111 - 900) + 50);
                  }
                  
                  // Example usage: Generate a random number between 1 and 10
                  const randomNum = getRandomNumber(1, 1060081); // Generates a number from 1 to 10 (inclusive)
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
  
                  
                                const id = randomNum +randomAlphanumeric+ randomNum2 ;
             connection.query("insert into users set user_id = ?, email = ?, password = ?", [id, email, dbpassword], (err, rows) => {
               //When done with the connection, release it
                connection.release();

                if(!err){
                    res.redirect("/user/events/" + id);
                }
                else{
                    console.log(err);
                }
             });
            }
            console.log('the data from user table: \n', rows);
        
    
    
        });
    
     });

    }
}