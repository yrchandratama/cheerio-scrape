const express = require('express');
const app = express();

// const mysql = require('mysql');

const merchantRoutes = require('./api/routes/merchants');
const categoryRoutes = require('./api/routes/categories');

// const db = mysql.createConnection({
//     host: process.env.MYSQL_HOST,
//     user: process.env.MYSQL_USER,
//     password: process.env.MYSQL_PASSWORD,
//     database: process.env.MYSQL_DATABASE
// });

// db.connect(err => {
//     if (err) {
//         console.log(err);
//     }
//     console.log("Connected to Database");

//     db.query(`
//         CREATE TABLE IF NOT EXISTS eats (
//             id INT PRIMARY KEY NOT NULL,
//             name VARCHAR(255) NOT NULL
//         );`
//     );

//     var sql = "INSERT INTO eats (id, name) VALUES ?";
//     var values = [
//         [80, 'Buffet'],
//         [2, 'Masakan Barat'],
//         [4, 'Masakan Asia'],
//         [5, 'Masakan Indonesia'],
//         [7, 'Hidangan Penutup'],
//         [78, 'Cemilan'],
//         [20, 'Lainnya']
//     ];
//     db.query(sql, [values]);
// })

app.use('/merchants', merchantRoutes);
app.use('/categories', categoryRoutes);

module.exports.app = app;
// module.exports.db = db;