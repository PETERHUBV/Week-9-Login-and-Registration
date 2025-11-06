import express from "express";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import jwt from "jsonwebtoken";
import cors from "cors";
import bcrypt from "bcrypt";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(
 cors({
    origin: "http://localhost:5173",
    credentials: false,
    allowedHeaders: "*",
    methods: "*",
 })
)
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 


 const client = new MongoClient.connect(process.env.MONGODB_URI);
   db = client.db(process.env.MONGODB_DBNAME || "MongoSetup" );
    const customerCollections= db.collection("customers");
async function connectDB() {
  try {
await MongoClient.connect();
 console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Failed to connect: ", err);
  }
}



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
next();
  })
};
 
connectDB().then(() => {
    app.listen(PORT, () => {
    console.log(`Server running on http://localhost: ${PORT}`);
     });

    });
    app.post("/customers",authenticateToken, async (req, res) => {
    try{
      
    const {username, email, password, first_name, last_name, phone, address} = req.body; 
    if(!username || !email || !password || !first_name || !last_name){
      return res.status(400).json({
        message: "Missing required fields.",
        fields: {username, email, password, first_name, last_name},//details
      });
    }
    const newCustomers = {...req.body, created_at: new Date()};
    const result = await customerCollections.insertone(newCustomers);
    res.status(201).json({
data: result,
message: "Working", customerId: result.insertedId });
    }catch(error){
res.status(500).json({
      message: "Error creating customer",
      details: error.message,
    
});
}
});

   app.get("/customers", async (req, res) => {
   try{
    const { username,  email} = req.query;
    let filter = {};
    if(username) filter.username = username;
    if(email) filter.email = email;

    const customers = await customerCollections.find(filter).toArray();
    res.status(200).json({data: customers,count: customers.length, message: "Customers retrieved successfully."});
   }catch(error) {

    res.status(500).json({message: "Error fetching customers.", error: error.message});
   }
   });
  
     
   app.get("/customers/:id",authenticateToken, async (req, res) => {
    try {
    const { id } = req.params;
    if (!mongodb.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid customer ID" });
    }
    const customer = await customersCollection.findOne({
      _id: new mongodb.ObjectId(id),
    });
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.status(200).json({ data: customer });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching customer",
      details: error.message,
      });
    }
 });
    
   
app.put("/customers/:id",authenticateToken, async (req, res) => {
  try{
    const { id } = req.params;
    if (!mongodb.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid customer ID" });
    }
    // Optional: Validate required fields if necessary
    const { username, email, password, first_name, last_name } = req.body;
    if (!username || !email || !password || !first_name || !last_name) {
      return res.status(400).json({
        message: "Missing required fields",
        details:
          "username, email, password, first_name, last_name are required",
      });
    }

    const updatedCustomer = { ...req.body, updated_at: new Date() };
    const result = await customersCollection.updateOne(
      { _id: new mongodb.ObjectId(id) },
      { $set: updatedCustomer }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.status(200).json({ message: "Customer updated successfully" });
}catch(error) {
  res.status(500).json({message: "Error updating customer.", error: message.error});
}
});
app.delete("/customers/:id",authenticateToken, async (req, res) => {
  try{
      const { id } = req.params;
    if (!mongodb.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid customer ID" });
    }

    const result = await customersCollection.deleteOne({
      _id: new mongodb.ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.status(200).json({ message: "Customer deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting customer",
      details: error.message,
    });
  }
});

app.post("/generateToken", (req, res) => {
  const { username } = req.body;
  if (!username) {
    return res.status(400).json({ error: "Username is required" });
  }

  const token = jwt.sign({ username }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  res.status(200).json({ token });
});

//endpoints for login, register, logout can be added here
app.post("/login", async (req, res) => {
  // Implement login logic here
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  const result = await customersCollection.findOne({
    username,
  });

  if (!result) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ username }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
  });

  res.status(200).json({ message: "Login successful" });
});

app.post("/register", async (req, res) => {
  // Implement registration logic here
  const { username, email, password, first_name, last_name } = req.body;
  if (!username || !email || !password || !first_name || !last_name) {
    return res.status(400).json({
      message: "Missing required fields",
      details: "username, email, password, first_name, last_name are required",
    });
  }

  // Check if the user already exists
  const existingUser = await customersCollection.findOne({ username });
  if (existingUser) {
    return res.status(409).json({ message: "User already exists" });
  }

  // Create a new user
  const newUser = {
    username,
    email,
    password: await bcrypt.hash(password, 10), //salt value of 10
    first_name,
    last_name,
    created_at: new Date(),
  };

  const result = await customersCollection.insertOne(newUser);
  res.status(201).json({
    message: "User registered successfully",
    user: result,
  });
});

app.logout("/logout", (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logout successful" });
});
