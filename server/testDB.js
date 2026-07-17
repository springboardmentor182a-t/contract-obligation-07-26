const pool = require("./config/db");


pool.query("SELECT NOW()", (err, result) => {

    if(err){
        console.log("Database connection failed ❌");
        console.log(err.message);
    }
    else{
        console.log("Database connected successfully ✅");
        console.log(result.rows);
    }

    pool.end();

});