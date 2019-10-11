const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const knex = require('knex')({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'Kyle',
      password : '',
      database : 'face-swap'
    }
  });
// const fpp = require('face-plusplus-node');

const APIkey = '1ltOS1IXZ1VTu_UyqY3S0HbV_DK3EJwA';
const APISecret = '2h4nPYp5Hs8qUAsfOM3H8TzQTKuoMZKZ';

// fpp.setApiKey(APIkey);
// fpp.setApiSecret(APISecret);

const app = express();
// app.use(bodyParser.json())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(cors());


app.get('/', (req,res) => {
    res.send("this is working");
})

app.post('/image', (req,res) => {
    const {template, merging } = req.body;
    // console.log(template);
    // console.log(merging);
    // const parameter = {
    //     // image_base64: template
    //     image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1GcaPGQyXCKT8k4F8LMdDaykGJ54toDWyN6yeoyO4zR4epD76'
    // }
    const params = {
        api_key: APIkey,
        api_secret: APISecret,
        // template_base64: template,
        template_url:template,
        // template_rectangle: template_rectangle,
        // merge_base64 : merging
        merge_url : merging
    };
    axios({
        method : 'post',
        url :'https://us.faceplusplus.com/imagepp/v1/mergeface',
        // headers: {'Content-type': 'application/json'},
        params : params
    })
    .then(response1 => {
        // const data = 'data:image/jpeg;base64,' + response1.data.result;
        const data =  response1.data;
        res.send(data);
    })
    .catch(err1 => console.log(err1))

    // fpp.post('/detect', parameter, (err,response) => {
    //     // console.log(response);
    //     // res.send(response);
    //     const {top, left, width, height} = response.faces[0].face_rectangle;
    //     const template_rectangle = `${top},${left},${width},${height}`;
    //     console.log(template_rectangle);
    //     const params = {
    //         api_key: APIkey,
    //         api_secret: APISecret,
    //         // template_base64: template,
    //         template_url: template,
    //         // template_url: 'https://goodmenproject.com/wp-content/uploads/2019/09/shutterstock_395314813.jpg',
    //         // template_rectangle: template_rectangle,
    //         // merge_base64 : merging
    //         merge_url : merging
    //         // merge_url :'https://mymodernmet.com/wp/wp-content/uploads/archive/9YPBjDyXBmK6zd25PAM1_gesichtermix14.jpg'
    //     };
    //     // this.fpp.mergeFace(merge, (success) => console.log(success), (error) => console.log(error));
    //     axios({
    //         method : 'post',
    //         url :'https://us.faceplusplus.com/imagepp/v1/mergeface',
    //         // headers: {'Content-type': 'application/json'},
    //         params : params
    //     })
    //     .then(response1 => {
    //         // const data = 'data:image/jpeg;base64,' + response1.data.result;
    //         const data =  response1.data;
            
    //         // const data = response1.json();
    //         // res.json(data);
    //         // console.log(data);
    //         res.send(data);
    //     })
    //     .catch(err1 => console.log(err1))
    // })
        
    
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