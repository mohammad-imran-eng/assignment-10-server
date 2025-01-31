const express = require('express')
const cors = require('cors');
require('dotenv').config()
const port = process.env.port || 5000;

const app = express();

// middleware
app.use(express.json());
app.use(cors());



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pdpul.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const run = async()=> {
  try {

    const equipmentCollection = client.db("equipmentDB").collection("equipment");

    app.get('/equipment',async(req,res)=> {
      const result = await equipmentCollection.find().toArray();
      res.send(result);
    })

    app.get('/equipment/:id',async(req,res)=> {
      const id = req.params.id;
      const query = { _id: new ObjectId(id)};
      const result = await equipmentCollection.findOne(query);
      res.send(result)
    })

    //my data find here

    app.get('/myequipment/:email',async(req,res)=> {
      const email = req.params.email;
      const query = { email }
      const result = await equipmentCollection.find(query).toArray();
      res.send(result);
    })


    app.post('/equipment',async(req,res)=> {
      const data = req.body;
      const result = await equipmentCollection.insertOne(data);
      res.send(result);
    })

    app.delete('/equipment/:id',async(req,res)=> {
      const id = req.params.id;
      const query = { _id: new ObjectId(id)};
      const result = await equipmentCollection.deleteOne(query);
      res.send(result);
    })

    app.put('/equipment/:id',async(req,res)=> {
      const id = req.params.id;
      const data = req.body;
      const filter = { _id: new ObjectId(id)};
      const updateDoc = {
        $set: {
          itemName: data.itemName,
          categoryName: data.categoryName,
          photo: data.photo,
          description: data.description,
          price: data.price,
          rating: data.rating,
          customization: data.customization,
          processingTime: data.processingTime,
          stockStatus: data.stockStatus,
          email: data.email
        }
      };
      const result = await equipmentCollection.updateOne(filter,updateDoc);
      res.send(result);
    })


   

   
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  }
  catch(error) {
    console.log(error);
  }
}

run()

app.get('/',(req,res)=> {
    res.send("server run");
})

app.listen(port,()=> {
    console.log(`Server is running on port: ${port}`);
})