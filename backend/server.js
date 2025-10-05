const express = require('express');
const cors = require('cors');
const app=express();
const mysql = require('mysql2');

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1210',
    database: 'todo'
});

db.connect((err)=>{
    if(err){
        console.log('Database connection failed',err);
        return;
    }
    console.log('Connected to database');
});

app.get('/',(req,res)=>{
    console.log('Default route');
    res.send("Hello from server");
});

app.post('/add-item',(req,res)=>{
    console.log(req.body);
    
    const query = "INSERT INTO todoItems(itemDescription) VALUES (?)";
    db.query(query, [req.body.text], (err, result) => {
    if(err){
        console.log('Error inserting item',err);
        res.status(500).send('Error inserting item');
        return;
    }
    console.log('Item inserted successfully');
    res.status(201).send({ success: true, id: result.insertId });
  });

});

app.listen(3000,()=>{
    console.log("Server is running on port 3000");
});

app.put('/edit-item/:id',(req,res)=>{
    console.log('Line 54 : ',req.body);
    db.query('UPDATE todoItems set itemDescription="Editing" where ID=3;', (err, result) => {
    if(err){
        console.log('Error updating item',err);
        res.status(500).send('Error updating item');
        return;
    }
    console.log('Item updated successfully');
    res.status(200).send({ success: true });
  });
});