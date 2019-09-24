const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const fpp = require('face-plusplus-node');
const APIkey = '1ltOS1IXZ1VTu_UyqY3S0HbV_DK3EJwA';
const APISecret = '2h4nPYp5Hs8qUAsfOM3H8TzQTKuoMZKZ';

fpp.setApiKey(APIkey);
fpp.setApiSecret(APISecret);

const app = express();
// app.use(bodyParser.json())
app.use(bodyParser.json({limit: '10mb', extended: true}));
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}));
app.use(cors());


app.get('/', (req,res) => {
    res.send("this is working");
})

app.post('/', (req,res) => {
    const {template } = req.body;
    const parameters = {
        image_base64: template
    }

    fpp.post('/detect', parameters, (err,response) => {
        res.send(response);
    })
    // console.log(template);
    // axios.post('https://api-us.faceplusplus.com/facepp/v3/detect', {
    //         // headers: {
    //         //     api_key: APIkey,
    //         //     api_secret: APISecret,
    //         // },
    //         image_base64: template, 
    //         // image_url : 'https://cnet3.cbsistatic.com/img/gk7d6AQXuqmtPNmnZI2gMaNySyA=/970x0/2018/09/05/7274da05-85a9-4646-b41f-a4b22c597507/captain-marvel-brie-larson-1.jpg'
    //     })
    //     .then((response) => {
    //         res.json(response);
    //     }, (error) => {
    //         console.log(error);
    //     })
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