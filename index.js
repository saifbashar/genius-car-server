const express = require('express');
const app = express();
const cors = require('cors');
const { ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
require('dotenv').config();
app.use(cors());
app.use(express.json());
const { MongoClient } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ucpzl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
async function run() {
  try {
    await client.connect();
    console.log('Connected to db');
    const database = client.db('carMachanic');
    const servicesCollection = database.collection('sevices');
    // GET API
    app.get('/services', async (req, res) => {
      const cursor = servicesCollection.find({});
      const services = await cursor.toArray();
      res.send(services);
    });

    // GET Single Services
    app.get('/services/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await servicesCollection.findOne(query);
      console.log(service);
      res.json(service);
    });
    // Delete API
    app.delete('/services/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await servicesCollection.deleteOne(query);
      // console.log(id);
      console.log('hitting delete ', result);
      res.json(result);
    });
    // POST API
    app.post('/services', async (req, res) => {
      const service = req.body;
      console.log(service);
      console.log('Hit the post api');
      // res.send('post hitted');
      const result = await servicesCollection.insertOne(service);
      console.log(`A document was inserted with the _id: ${result.insertedId}`);
      console.log(result);
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Running Genius Server');
});

app.listen(port, () => {
  console.log('listening on port ' + port);
});
