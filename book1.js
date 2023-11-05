const express = require("express");
const app = express();
const mongodb = require("mongodb").MongoClient;

app.use(express.static('Public'));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/add', (req, res) => {
  const document = {
    name: req.body.name,
    email: req.body.email,
    datetime: req.body.datetime,
    persons: req.body.select1,
    message: req.body.message,
  };
  console.log(document);
  main(document, res);
});

async function main(document, res) {
  try {
    const client = await mongodb.connect("mongodb://127.0.0.1:27017/Rsm");
    if (client) {
      console.log("Database Connected!!");
    } else {
      console.log("Database Connection Failed!!");
      return;
    }
    const db = client.db("Rsm");
    const collection = await db.createCollection("BookingTable");
    if (collection) {
      console.log("Collection Created!!");
    } else {
      console.log("Collection Creation Failed!!");
    }
    await insertDocument(collection, document);
    await display(collection, res);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    client.close();
  }
}

async function insertDocument(collection, document) {
  console.log('Insertion');
  try {
    const insert = await collection.insertOne(document);
    if (insert) {
      console.log('Inserted!!');
    } else {
      console.log('Insertion Failed!!');
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

async function display(collection, res) {
  try {
    const result = await collection.find().toArray();
    if (result) {
      console.log(result);
      res.send(result); // Send the result back to the client
    } else {
      console.log('Sorry...No document found!!');
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

app.listen(3000, () => {
  console.log(`Server is running on port 3000`);
});
