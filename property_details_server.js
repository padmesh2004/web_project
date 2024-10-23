var mysql = require('mysql');

// Create a connection to the MySQL server (without specifying the database)
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: ""
});

// Connect to the server
con.connect(function(err) {
  if (err) throw err;
  console.log("Connected to MySQL server!");

  // Create the 'customers' database if it doesn't exist
  con.query("CREATE DATABASE IF NOT EXISTS customers", function (err, result) {
    if (err) throw err;
    console.log("Database 'customers' created or already exists.");

    // Switch to the 'customers' database
    con.changeUser({database: 'customers'}, function(err) {
      if (err) throw err;
      console.log("Switched to 'customers' database.");

      // SQL query to create the 'customers_table'
      var sql = `CREATE TABLE IF NOT EXISTS customers_table (
        customer_id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        customer_username VARCHAR(255) NOT NULL,
        age INT,
        marital_status VARCHAR(50),
        buy_rent_status JSON DEFAULT '[]',
        property_ids JSON DEFAULT '[]'
      )`;

      // Execute the SQL query to create the table
      con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Table 'customers_table' created or already exists.");
      });
    });
  });
});
