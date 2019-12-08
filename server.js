const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const knex = require('knex');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const axios = require('axios');

const APIkey = '1ltOS1IXZ1VTu_UyqY3S0HbV_DK3EJwA';
const APISecret = '2h4nPYp5Hs8qUAsfOM3H8TzQTKuoMZKZ';

const db = knex({
    client: 'pg',
    connection: {
      connectString : process.env.DATABASE_URL,
      ssl: true,
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
                        .then(user => res.json(user[0]))
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
        .returning('entries')
        .then(entries => res.json(entries[0]))
        .catch(err => res.status(400).json('Unable to get entries'))
})

app.post('/imageurl', (req,res) => {
    const { template, merging } = req.body;

    const params = {
        api_key: APIkey,
        api_secret: APISecret,
        template_url:template,
        merge_url : merging
    };

    axios({
        method : 'post',
        url :'https://us.faceplusplus.com/imagepp/v1/mergeface',
        params : params
    })
    .then(response => {
        res.send(response.data);
    })
    .catch(err => res.status(400).json('Failed to merge images'))
})


app.listen( process.env.PORT || 8000, () =>  {
    console.log("app is running on port 8000");
})