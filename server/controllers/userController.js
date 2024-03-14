const mysql = require('mysql');

const QRCode = require('qrcode-generator');


//connection pool
const pool = mysql.createPool({
    connectionLimit : 100,
    host : process.env.DB_HOST,
    user  : process.env.DB_USER,
    password : process.env.DB_PASS,
    database : process.env.DB_NAME


});

// connect to db




// view guests
exports.view = (req, res) => {


    pool.getConnection((err, connection) => {
        if(err)throw err; //not connected
        console.log('connected as ID' + connection.threadId);

        //guest connection
        connection.query('               select * from  guests right join e_v_e_n_t_s on guests.ev_id = e_v_e_n_t_s.event_id  where  event_id = ?        ;            ', [req.params.id], (err, rows) => {
            //When done with the connection, release it
            connection.release();

             if(!rows[0]){
                res.status(404).render('404');

            }else if(rows[0] && rows[0].id === null){
                res.render("no-guest", {rows});
            }else if(err){
                console.log(err);

            }
            else{
                let removedUser= req.query.removed;
                res.render('guest-list', {rows, removedUser});
            }
            console.log('the data from guests table: \n', rows);



        });

     });


};

// find guest by search
exports.find = (req, res) => {
    

    pool.getConnection((err, connection) => {
        if(err)throw err; //not connected
        console.log('connected as ID' + connection.threadId);

        let searchTerm = req.body.search

        //guest connection
        connection.query(' select * from guests right join e_v_e_n_t_s on guests.ev_id = e_v_e_n_t_s.event_id where  e_v_e_n_t_s.event_id = ? and FirstName LIKE ? or phone LIKE ? ', [req.params.id, '%' + searchTerm + '%','%' + searchTerm + '%'], (err, rows) => {
            //When done with the connection, release it
            connection.release();

            if(err){
                console.log(err);

            }
             else  if(!rows[0]){
                res.render("no-selected-guest");
            }
            else{
                res.render('guest-list', {rows});
            }
            console.log('the data from guests table: \n', rows);



        });

     });

}

// add guest
exports.form = (req, res) => {
    pool.getConnection((err, connection) => {
        if(err)throw err; //not connected
        console.log('connected as ID' + connection.threadId);

        //guest connection
        connection.query('select * from e_v_e_n_t_s where event_id = ?', [req.params.id], (err, rows) => {
            //When done with the connection, release it
            connection.release();

            if(!rows[0]){
                res.status(404).render('404');
            }
            else if(!err){
                res.render('add-user', {rows});
            }else{
                console.log(err);
            }
            console.log('the data from guest table: \n', rows);  


        });

     });}

//add guest
exports.create = (req, res) => {
    const {FirstName, phone} = req.body;

pool.getConnection((err, connection) => {
    if(err)throw err; //not connected
    console.log('connected as ID' + connection.threadId);

    let searchTerm = req.body.search

    // Generate a random number between min (inclusive) and max (exclusive)
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (10057 - 5564) + 57550);
  }
  
  // Example usage: Generate a random number between 1 and 10
  const randomNum = getRandomNumber(1, 1661); // Generates a number from 1 to 10 (inclusive)
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
  
  

    const id = randomNum + req.params.id + randomNum2 + randomAlphanumeric;


    
    const url = `http://localhost:5000/viewuser/${id}`


    const qr = QRCode(0, 'M');
    const qrCodeUrl = url; // Replace with your actual URL structure
    qr.addData(qrCodeUrl);
    qr.make();


    
    // Create a data URL for the QR code image
    const qrCodeDataUrl = qr.createDataURL(10, 0);



    //guest connection
    connection.query('INSERT INTO guests SET id = ?, FirstName = ?, phone = ?, qr = ?, ev_id = ? ',[id, FirstName, phone, qrCodeDataUrl,  req.params.id], (err, rows) => {
        //When done with the connection, release it
        connection.release();

        if(!err){
            res.redirect('/viewuser/' + id);
        }else{
            console.log(err);
        }
        console.log('the data from guest table: \n', rows);

    });

 });
}



//edit guest
exports.edit = (req, res) => {
pool.getConnection((err, connection) => {
    if(err)throw err; //not connected
    console.log('connected as ID' + connection.threadId);

    //guest connection

    connection.query('select * from guests WHERE id  = ?', [req.params.id], (err, rows) => {
        //When done with the connection, release it
        connection.release();
  
        if(!err){
            res.render('edit-user', {rows});
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



//update guest
exports.update = (req, res) => {
    const {FirstName ,phone} = req.body;

pool.getConnection((err, connection) => {
    if(err)throw err; //not connected
    console.log('connected as ID' + connection.threadId);

    //guest connection

    connection.query('UPDATE guests SET  FirstName = ?, phone = ? WHERE id  = ?',[ FirstName, phone, req.params.id], (err, rows) => {
        //When done with the connection, release it
        connection.release();

        if(!err){
            pool.getConnection((err, connection) => {
                if(err)throw err; //not connected
                console.log('connected as ID' + connection.threadId);
            
                //user connection
            
                connection.query('select * from guests WHERE id  = ?', [req.params.id], (err, rows) => {
                    //When done with the connection, release it
                    connection.release();
                    if(!rows[0]){
                        res.status(404).render('404');
                    }
                   else if(!err){
                        res.render('edit-user', {rows, alert:`${FirstName}'s information has success full been updated`});
                    }else{
                        console.log(err);
                    }
                    console.log('the data from guest table: \n', rows);
            
            
            
                });
            
             });
        }else{
            console.log(err);
        }
        console.log('the data from guest table: \n', rows);



    });

 });
}


exports.delete = (req, res) => {
    // pool.getConnection((err, connection) => {
    //     if(err)throw err; //not connected
    //     console.log('connected as ID' + connection.threadId);
    
    //     //guest connection
    
    //     connection.query('DELETE from guest WHERE id  = ?', [req.params.id], (err, rows) => {
    //         //When done with the connection, release it
    //         connection.release();
    
    //         if(!err){
    //             res.redirect('/');
    //         }else{
    //             console.log(err);
    //         }
    //         console.log('the data from guest table: \n', rows);  
    //     });
    
    //  });




    pool.getConnection((err, connection) => {
        if(err)throw err; //not connected
        console.log('connected as ID' + connection.threadId);
    
        //guest connection
    
        connection.query('UPDATE guests SET status = ? WHERE id  = ?', [`Arrived`, req.params.id], (err, rows) => {
            //When done with the connection, release it
            connection.release();
       
            if(!err){
                let = removedUser = encodeURIComponent('guest successfully Deleted.')
                res.render('arrived');
            }else{
                console.log(err);
            }
            console.log('the data from guest table: \n', rows);  
        });
    
     });
    }

    exports.viewall = (req, res) => {
        pool.getConnection((err, connection) => {
            if(err)throw err; //not connected
            console.log('connected as ID' + connection.threadId);
    
            //guest connection
            connection.query('     select * from guests  inner join e_v_e_n_t_s on guests.ev_id = e_v_e_n_t_s.event_id WHERE id  = ?            ', [req.params.id], (err, rows) => {
                //When done with the connection, release it
                connection.release();
 
                if(err){
                    console.log(err);
                }
               else if(!rows[0]){
                    res.render('no-selected-guest');
                }
                else{
                    res.render('view-user', {rows, alert:"Use the provided buttons to send the invitation"});
                }
                console.log('the data from guest table: \n', rows);
    
    
    
            });
    
         });
    
    
    };

    exports.gestview = (req, res) => {
        pool.getConnection((err, connection) => {
            if(err)throw err; //not connected
            console.log('connected as ID' + connection.threadId);
    
            //guest connection
            connection.query('select * from guests  inner join e_v_e_n_t_s on guests.ev_id = e_v_e_n_t_s.event_id WHERE id  = ?', [req.params.id], (err, rows) => {
                //When done with the connection, release it
                connection.release();
    
                if(err){
                    console.log(err);
                }
                  else if(!rows[0]){
                    res.status(404).render('404');
                }
                else if(rows[0].event_type === "fest"){
                    res.render('fest', {rows});

                }
                else if(rows[0].event_type === "get together"){
                    res.render('get-together', {rows, alert: "kindly present at the entrance"});

                }
                else if(rows[0].event_type === "meeting"){
                    res.render('meetingIV', {rows, alert: "kindly present at the entrance"});

                }
                else if(rows[0].event_type === "wedding"){
                    res.render('weddingIV', {rows, alert: "kindly present at the entrance"});

                }
               
                else{
                    res.render('guest-view', {rows, alert: "kindly present at the entrance"});
                }
                console.log('the data from guest table: \n', rows);
    
    
    
            });
    
         });
    
    
    };


    exports.arrived = (req, res) => {
        res.render('arrived');
    }
    exports.np = (req, res) => {
        res.render('404');
    }

    