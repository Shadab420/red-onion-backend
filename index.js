const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

const app = express(cors());
app.use(bodyParser.json());


//mongo atlas database connection
const uri = process.env.DB_PATH;

const client = new MongoClient(uri, { useNewUrlParser: true });

// respond with "hello world" when a GET request is made to the homepage
app.get('/', function (req, res) {
  res.send('hello api')
})


app.get('/foods', (req, res) => {
    const client = new MongoClient(uri, { useNewUrlParser: true });

    client.connect(err => {
        const collection = client.db("redOnion").collection("foods");
        // perform actions on the collection object
        collection.find().toArray((err, documents) => {
           if(err) {
               console.log(err);
               res.status(500).send({message: err.message});
           }
           else{
               res.status(200).send(documents);
           } 
            
        })
        client.close();
    });
})

app.post('/addFoods', (req, res) => {

    const foods = req.body;

    const client = new MongoClient(uri, { useNewUrlParser: true });

    client.connect(err => {
        const collection = client.db("redOnion").collection("foods");
        // perform actions on the collection object
        collection.insert(foods, (err, result) => {
           if(err) {
               console.log(err);
               res.status(500).send({message: err.message});
           }
           else{
               console.log("insertion success!")
               res.status(200).send(result.ops[0]);
           } 
            
        })
        client.close();
    });

})

app.post('/placeOrder',(req,res) => {
    const orderDetails = req.body;
    orderDetails.orderTime = new Date();

    const client = new MongoClient(uri, { useNewUrlParser: true });

    client.connect(err => {
        const collection = client.db("redOnion").collection("orders");
        // perform actions on the collection object
        collection.insertOne(orderDetails, (err, result) => {
           if(err) {
               console.log(err);
               res.status(500).send({message: err.message});
           }
           else{
               console.log("Order information saved!")
               res.status(200).send(result.ops[0]);
           } 
            
        })
        client.close();
    });
})

app.get("/orders", (req,res) => {

    const client = new MongoClient(uri, { useNewUrlParser: true });

    client.connect(err => {
        const collection = client.db("redOnion").collection("orders");
        // perform actions on the collection object
        collection.find().toArray((err, documents) => {
           if(err) {
               console.log(err);
               res.status(500).send({message: err.message});
           }
           else{
               res.status(200).send(documents);
           } 
            
        })
        client.close();
    });
})

const port = process.env.PORT || 4200;
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))