const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const knex = require('knex');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : 'postgres',
      database : 'postgres'
    }
});
db.select('*').from('users').then(data => {
    console.log(data);
});
// console.log(db);
// console.log(db.select('*').from('users'));
// db.select('*').from('users');

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
    const { email, password } = req.body;
    if (!email || !password){
        return res.status(400).json('Unable to sign in');
    }

})

app.post('/register', (req,res) => {
    const { name, email, password } = req.body;
    if (!email || !password || !name){
        return res.status(400).json('Unable to register');
    }
    const hash = bcrypt.hashSync(password, saltRounds);

    db.transaction((trx) => {
        trx('login')
            .returning('email')
            .insert({
                email: email,
                hash : hash
            })
            .then(email => {
                return trx('users')
                        .returning('*')
                        .insert({
                            name : name,
                            email: email[0],
                            joined: new Date()
                        })
                        .then(user => res.json(user))
                        .catch(error => res.status(400).json("Unable to register"))
            })
            .then(trx.commit)
            .catch(trx.rollback)
    })
    .catch(err => res.status(400).json('Unable to register'))
    
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