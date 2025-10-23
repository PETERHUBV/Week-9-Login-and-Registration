import express from "express";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import jwt from "jsonwebtoken";
dotenv.config();
app.use(express.urlencoded({ extended: true })); 

async function connectDB() {
  const authenticateToken = (req, res, next) => {
    const authenHeader = req.headers["authorization"]; 
     const token = authHeader&& authHeader.split(" ")[1];
     if(!token){
      return res.status (401).json({ error: "Access token required "});
  }
  jwt.verify (token, process.env.JWT_TOKEN, (err, user) => { 
    if (err) {
      return res.status(403).json({error: "Invalid or expired token."});
    }
req.user  = user;
  })
};
  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI);
    db = client.db(process.env.MONGODB_DBNAME);
    const customerCollections= db.collection("customers");
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
    console.log(`Server running on http://localhost: ${PORT}`);
     });
     app.get("/", (req, res) => {
    res.status(200).json({
      message: "Welcome to Web Programming MongoDB.",
    });
    

    });
 
  });
   app.get("/customer", async (req, res) => {
   try{
    const { username,  email} = req.query;
    let filter = {};
    if(username) filter.username = username;
    if(email) filter.email = email;

    const customers = await customerCollections.find(filter).toArray();
    res.status(200).json({data: customers, message: "Customers retrieved successfully."});
   }catch(error) {

    res.status(500).json({message: "Internal Server Error.", error: error.message});
   }
   });
   app.post("/customers", async (req, res) => {
    try{
      
    const {username, email, password, first_name, last_name, phone, address} = req.body; 
    if(!username || !email || !password || !first_name || !last_name){
      return res.status(400).json({
        message: "Missing required fields.",
        fields: {username, email, password, first_name, last_name},
      });
    }
    const newCustomers = {...req.body, created_at: new Date()};
    const result = await customerCollections.insertone(newCustomers);
    res.status(201).json({
data: result,
message: "Working"
});

app.put("/customers/:id", async (req, res) => {
  try{
    const {username, email, password, first_name, lastIname, phone, address}= req.body;
    if(!username || email || !password || !first_name || last_name){
      return res.status(400).json({
        message: "Missing required fields.",
        fields: {username, email, password, first_name, last_name},
      });
    } 
    const customerID = new mongodb.ObjectId (req.params.id);
    const updatedCustomer = { ...req.body, updated_at: new Date()};
    const result = await customerCollections.updateOne({_id: customerID}, {$set: updatedCustomer});
res.status(200).json({
  data: result,
message: "customer updated is succeed successfully"


});
}catch(error) {
  res.status(500).json({message: "Internal Server Error.", error: message.error});
}
});
app.delete("/customers/:id", async (req, res) => {
  try{
    const customerID = new mongodb.ObjectId (req.params.id);
    const result = await customerCollections.deleteOne({_id: customerID});

res.status(200).json({
  data: result,
message: "customer deleted is succeed successfully"
});
}catch(error) {
res.status(500).json({message: "Internal Server Error.", error: message.error});
}
});
    

