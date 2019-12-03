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

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(cors());


app.get('/', (req,res) => {
    res.send("this is working");
})

app.post('/signin', (req,res) => {
    const { email, password } = req.body;
    if (!email || !password){
        return res.status(400).json('Unable to sign in');
    }

    db('login')
        .where('email',email)
        .select('*')
        .then(data => {
            const isValid = bcrypt.compareSync(password, data[0].hash);
            if (isValid){
                return db('users')
                        .select('*')
                        .where('email', email)
                        .then(user => {
                            res.json(user[0]);
                        })
                        .catch(err => res.status(400).json('Unable to get user'))
            } else {
                res.status(400).json('Wrong credentials');
            }          
        })
        .catch(err => res.status(400).json('Wrong credentials'))
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

app.put('/image', (req,res) => {
    const { email } = req.body;
    db('users')
        .where('email', email)
        .increment('entries', 1)
        .returning('*')
        .then(user => res.json(user[0]))
        .catch(err => res.status(400).json('Unable to get entries'))
})
/*
/ --> res 
/singin --> post
/register --> post
/profile/:userId --> get
/image -->PUT -->user

*/


app.listen( process.env.PORT || 8000, () =>  {
    console.log("app is running on port 8000");
})