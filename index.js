const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const express = require('express');
const cors = require('cors');
const app = express()
const port = process.env.PORT || 5000

// middleware
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.awayh34.mongodb.net/?retryWrites=true&w=majority`;

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
        await client.connect();
        const coffeeCollection = client.db("CoffeeDB").collection("coffee");
        const userAuthCollection = client.db("CoffeeDB").collection("user");
        app.get('/coffee', async (req, res) => {
            const cursor = coffeeCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })
        app.get('/coffee/:id', async (req, res) => {
            const id = req.params.id
            console.log(id)
            const query = { _id: new ObjectId(id) };
            console.log(query)

            const result = await coffeeCollection.findOne(query);
            console.log(result)
            res.send(result)
        })
        app.post('/coffee', async (req, res) => {
            const newCoffee = req.body
            const result = await coffeeCollection.insertOne(newCoffee);
            res.send(result)
            console.log(result)
        })
        app.put('/coffee/:id', async (req, res) => {
            const id = req.params.id
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updatedCoffee = req.body;
            const coffee = {
                $set: {
                    name: updatedCoffee.name,
                    chef: updatedCoffee.chef,
                    supplier: updatedCoffee.supplier,
                    taste: updatedCoffee.taste,
                    category: updatedCoffee.category,
                    details: updatedCoffee.details,
                    photo: updatedCoffee.photo,
                }
            }
            const result = await coffeeCollection.updateOne(filter, coffee, options);
            res.send(result)
        })
        app.delete('/coffee/:id', async (req, res) => {
            const id = req.params.id
            console.log(id)
            const query = { _id: new ObjectId(id) };
            console.log(query)
            const result = await coffeeCollection.deleteOne(query);
            console.log(result)
            res.send(result)
        })
        app.post('/user', async (req, res) => {
            const newUser = req.body
            const result = await userAuthCollection.insertOne(newUser);
            res.send(result)
            console.log(result)
        })
        app.get('/user', async (req, res) => {

            const result = await userAuthCollection.find().toArray();
            res.send(result)
            console.log(result)
        })
        app.patch('/users',async (req,res)=>{
            const user=req.body
            const query={email: user.email}
            // const option={upsert:true}
            const updatedUser={
                $set :{
                    lastLoggedAt:user.lastLoggedAt
                }
            }
            const result = await userAuthCollection.updateOne(query,updatedUser);
            res.send(result)
            console.log(user,result)


        })
        app.delete('/users/:id', async (req, res) => {
            console.log(req.params.id)
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await userAuthCollection.deleteOne(query);
            console.log(result)
            res.send(result)

        })
    

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // await client.close();
    }
}
run().catch(console.dir);






app.get('/', (req, res) => {
    res.send("coffee")
})

app.listen(port, () => {
    console.log(`coffee server is running ,${port}`)
})