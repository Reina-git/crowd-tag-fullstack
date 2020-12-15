require("dotenv").config();
const mysql = require("mysql");
const connection = mysql.createConnection({
   host: process.env.RDS_HOST,
   user: process.env.RDS_USER,
   password: process.env.RDS_PASSWORD,
   database: "crowd_tag_app",
});

connection.connect();

connection.query(
   `
SELECT
   *
FROM
   users
`,

   (error, results, fields) => {
      if (error) {
         console.log(error);
      } else {
         console.log(results);
      }
   }
);

connection.end();
