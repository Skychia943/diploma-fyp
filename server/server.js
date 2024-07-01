/* =========================== MODULES =========================== */

/* ========== CONNECTION MODULE ========== */
import express from "express";
import cors from "cors";

/* ========== DATABASE MODULE ========== */
import { MongoClient, ServerApiVersion } from "mongodb";

/* ========== API KEYS MODULE ========== */
import * as dotenv from "dotenv";

/* ========== ACCESS TO ENVIRONMENT VARIABLES (ENV) ========== */
dotenv.config();

/* ========== CONNECT EXPRESS, CORS ========== */
const app = express();
app.use(cors());
app.use(express.json());

/* ========== EXTRACT KEYS FROM ENV FILE ========== */
const { MONGO_URI } = process.env;

/* ========== CONNECT TO MONGODB ========== */
const client = new MongoClient(MONGO_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const initializeMongoClient = async () => {
  try {
    await client.connect();
    console.log("Connected to the database");
  } catch (error) {
    console.error("Error connecting to the database", error);
  }
}

initializeMongoClient().catch(console.dir);

/* ========== GLOBAL VARIABLES FOR MONGODB DATABASE ========== */
const database = client.db("HMS");
const users = database.collection("users");

/* ========== ROUTES ========== */
app.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate all fields
    if (!username || !email || !password) {
      res.status(400).json({ message: "Please fill in all fields" });
      return;
    }

    // CREATE UNIQUE INDEXES ON USERNAME AND EMAIL
    await users.createIndex({ username: 1 }, { unique: true });
    await users.createIndex({ email: 1 }, { unique: true });

    // Save user to database
    const insert = await users.insertOne({ username, email, password });

    // Send response to client
    if (insert.acknowledged === true) {
      res.status(201).json({ message: "User signed up successfully" });
    } else {
      res.status(400).json({ message: "Error signing up" });
    }

  } catch (error) {
    console.error("Error signing up", error);
  }
})

/* ========== PORT ========== */
app.listen(5001, () => {
  console.log("Server is running on port 5001");
})