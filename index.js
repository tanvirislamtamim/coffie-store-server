const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 3000;





app.use(cors());
app.use(express.json());


console.log(process.env.DB_USER)

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yizffch.mongodb.net/?appName=Cluster0`;
// const uri = "mongodb+srv://<db_username>:<db_password>@cluster0.yizffch.mongodb.net/?appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {

    const coffeeCollection = client.db('coffeeDB').collection('coffees')

    app.get('/coffees', async(req,res)=>{
      const result = await coffeeCollection.find().toArray();
      res.send(result);
    })
    app.get('/coffees/:id', async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await coffeeCollection.findOne(query);
      res.send(result);
    })


    app.post('/coffees', async(req,res)=>{
      const newCoffee = req.body;
      const result = await coffeeCollection.insertOne(newCoffee);
      res.send(result);
    })

    app.put('/coffees/:id', async(req,res)=>{
      const id = req.params.id;
      const filter= {_id: new ObjectId(id)};
      const options = {upsert: true};
      const UpdatedCoffee = req.body;
      const UpdateDocs = {
        $set: UpdatedCoffee
      }
      const result = await coffeeCollection.updateOne(filter, UpdateDocs, options);
      res.send(result); 

    })

    app.delete('/coffees/:id', async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await coffeeCollection.deleteOne(query);
      res.send(result);
    })


    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/',(req, res)=>{
    res.send('coffie is getting hotter')
})

app.listen(port, ()=>{
    console.log(`Coffie server is running on port: ${port}`)
})