import express from "express";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
dotenv.config();
async function connectDB() {
  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI);
    db = client.db(process.env.MONGODB_DBNAME);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Failed to connect: ", err);
  }
}
const app = express();
app.use(express.json);
const PORT = process.env.PORT || 3000;

connectDB().then(() => {
    app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
     });
     app.get("/", (req, res) => {
    res.status(200).json({
      message: "Welcome to Web Programming MongoDB.",
    });
    
    app.get("(/Start)",(req, res)=> {
        res.send("Received");
    });
 
  });
   app.post("/customer", async (req, res) => {
    //name, address, email, contact
    const { name, address, email, contact } = req.body; //null

    console.log("post: ", name, address, email, contact);
    //   const client = MongoClient(process.env.MONGODB_URI);
    //   await client.connect();
    //   const db = client.db(process.env.MONGODB_DBNAME);
    //   const collection = db.collection("customers");

    //   const customer = await collection.insertOne({
    //     name,
    //     address,
    //     email,
    //     contact,
    //   });
const client = new.mongodb.MongoClient(process.env.MONGODB_URI );
const dbName = process.env.MONGODB_DBNAME ||  "setup_express"
const db = client.db(dbName);

async function connectToDatabase(){
  try{
    await client.connect();
    console.log("connected to MongoDB")

  } catch(error){
console.error("Failed to connect to the database", error);
  }
}
 connectToDatabase().then(() => {
app.listen(PORT,() => {
  console.log('Server is running on mongodb://localhost:${PORT}')
});

app.get("/customers",async(req,res) =>{
try{
  const {username, email}= req.query;
  let filter ={};
  if(username)filter.username = username;
  if(email)filter.email= email;
  const customers = await customerCollections.find(filter).toArray();

res 
.status(200)
.json({data: customers, message: "Customers retrieved successfully"});
 } catch(error){
    res 
    .status(500)
    .json({message: "Internal Server Error", error: error.message});
  }
 }
 function routeExists(path, method){
  const normalizedPath =
  path.endsWith("/") && path.length > 1 ? path.slice(0,-1): path;
  for (const layer of app.router.stack){
if(layer.route){
  const routePath =
  layer.route.path.endsWith("/") && layer.route.path.length>1
  ? layer.route.path.slice(0,-1)
  : layer.route.path;

  if(routePath === normalizedPath){
    for (const m in layer.route.methods){
      if(m === method.toLowerCase()){
        return true;
      }

    }
  }
}
 app.post("/customer", async (req, res) => {
  try{
    //name, address, email, contact
    const { name, address, email, contact } = req.body

    if(!username || !email, || first_name, last_name),
  
  }
  const newCustomer = {...req.body, created_at: new Date()};
  const result = await customerCollections.insertOne
} catch (error){
    res 
    .status(500)
    .json({message: "Internal Server Error", error: error.message});
 }
const CustomerId = new.mongodb.ObjectId(req.params.id);
const updatedCustomer = {...req.body, updated_at: new Date() };
const result = await customerCollections.updateOne(
  {_id: customerID}, {$set: updatedCustomer}
);

}
    res.status(201).json({
      message: "Customer successfully created",
      data: customer,
      
    });
  });
    });
