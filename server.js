const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const uuid = require('uuid/v4');
const knex = require('knex');

const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : 'password',
      database : 'face-swap-api'
    }
});
db.select('*').from('users').then(data => {
    console.log(data);
});

// console.log(db.select('*').from('users'));

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(cors());


app.get('/', (req,res) => {
    res.send("this is working");
})

app.post('/image', (req,res) => {
    
})

app.post('/signin', (req,res) => {

})

app.post('/register', (req,res) => {
    const { name, email, password } = req.body;
    db('users').insert({
        name : name,
        email: email,
        entries: 0,
        joined: new Date()
    }).then(console.log);
    res.send("register");
})
/*
/ --> res 
/singin --> post
/register --> post
/profile/:userId --> get
/image -->PUT -->user

*/


app.listen(8000, () =>  {
    console.log("app is running on port 8000");
})