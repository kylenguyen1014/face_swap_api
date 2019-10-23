const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const knex = require('knex');

const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'Kyle',
      password : '2bdangyeuroi',
      database : 'face-swap'
    }
});
db.select('*').from('users').then(data => {
    console.log(data);





const app = express();
// app.use(bodyParser.json())
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

app.post('register', (req,res) => {

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