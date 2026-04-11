const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ================= DATABASE CONNECTION =================
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Trupti@2007",
  database: "SFITS_DBMS_PRJ",
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    return;
  }
  console.log("MySQL Connected!");
});

// ================= TEST ROUTE =================
app.get("/", (req, res) => {
  res.send("Backend running");
});

// ================= SIGNUP API =================
app.post("/signup", (req, res) => {
  const { username, email, password, role } = req.body;

  const query =
    "INSERT INTO USERS (username, email, password, role) VALUES (?, ?, ?, ?)";

  db.query(query, [username, email, password, role], (err, result) => {
    if (err) {
      console.error("Signup Error:", err);
      return res.status(500).send("Signup failed");
    }
    res.send("Signup successful");
  });
});

// ================= LOGIN API =================
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const query = "SELECT * FROM USERS WHERE email = ? AND password = ?";

  db.query(query, [email, password], (err, result) => {
    if (err) {
      console.error("Login Error:", err);
      return res.status(500).send("Server error");
    }

    if (result.length > 0) {
      res.json(result[0]);
    } else {
      res.status(401).send("Invalid credentials");
    }
  });
});

// ================= STARTUP APIs =================
app.post("/addStartup", (req, res) => {
  const { name, year, stage, city, state, country } = req.body;

  // generate random id
  const startup_id = "S" + Math.floor(1000 + Math.random() * 9000);
  const query = `
    INSERT INTO STARTUP (startup_id, startup_name, founded_year, stage, city, state, country)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [startup_id, name, year, stage, city, state, country],
    (err) => {
      if (err) {
        console.error("Startup Insert Error:", err);
        return res.status(500).send("Error adding startup");
      }
      res.send("Startup added");
    },
  );
});

app.get("/startups", (req, res) => {
  db.query("SELECT * FROM STARTUP", (err, result) => {
    if (err) {
      console.error("Fetch Error:", err);
      return res.status(500).send("Error fetching startups");
    }
    res.json(result);
  });
});

// ================= START SERVER =================
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});

// ================= FOUNDER API =================
app.post("/addFounder", (req, res) => {
  console.log("API HIT"); // 👈 debug

  const { name, equity, startup_id } = req.body;

  const founder_id = "F" + Math.floor(1000 + Math.random() * 9000);

  const query = `
    INSERT INTO FOUNDER (founder_id, founder_name, startup_id, equity)
    VALUES (?, ?, ?, ?)
  `;

  db.query(query, [founder_id, name, startup_id, equity], (err) => {
    if (err) {
      console.error("Founder Error:", err);
      return res.status(500).send("Error adding founder");
    }

    res.send("Founder added");
  });
});
