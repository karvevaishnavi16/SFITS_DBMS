// ================= IMPORTS & APP SETUP =================
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

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

// ================= AUTHENTICATION APIs =================
app.post("/signup", (req, res) => {
  const { username, email, password, role } = req.body;

  const query =
    "INSERT INTO USERS (username, email, password, role) VALUES (?, ?, ?, ?)";

  db.query(query, [username, email, password, role], (err) => {
    if (err) {
      console.error("Signup Error:", err);
      return res.status(500).send("Signup failed");
    }
    res.send("Signup successful");
  });
});

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

// ================= STARTUP MANAGEMENT APIs =================
app.post("/addStartup", (req, res) => {
  const { name, year, stage, industry_id, city, state, country, user_id } =
    req.body;

  if (!user_id || !industry_id) {
    return res.status(400).send("Missing required fields");
  }

  const startup_id = "S" + Math.floor(1000 + Math.random() * 9000);

  const query = `
    INSERT INTO STARTUP 
    (startup_id, startup_name, founded_year, stage, city, state, country, industry_id, user_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [startup_id, name, year, stage, city, state, country, industry_id, user_id],
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Database error");
      }
      res.send("Startup added");
    },
  );
});

app.get("/startups/:user_id", (req, res) => {
  const { user_id } = req.params;

  const query = "SELECT * FROM STARTUP WHERE user_id = ?";

  db.query(query, [user_id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error fetching startups");
    }

    res.json(result);
  });
});

// ================= FOUNDER MANAGEMENT APIs =================
app.post("/addFounder", (req, res) => {
  const { name, role, equity, startup_id } = req.body;

  console.log("DATA:", name, role, equity, startup_id);

  if (!name || equity === undefined || equity === "" || !startup_id) {
    return res.status(400).send("Missing fields");
  }

  const equityNum = Number(equity);
  if (isNaN(equityNum)) {
    return res.status(400).send("Equity must be a number");
  }

  const founder_id = "F" + Math.floor(Math.random() * 10000);

  const checkQuery = `
    SELECT IFNULL(SUM(initial_equity),0) AS total 
    FROM FOUNDER 
    WHERE startup_id = ?
  `;

  db.query(checkQuery, [startup_id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send(err.sqlMessage);
    }

    const total = result[0].total;

    if (total + equityNum > 100) {
      return res.status(400).send("Total equity cannot exceed 100%");
    }

    const query = `
      INSERT INTO FOUNDER 
      (founder_id, founder_name, founder_role, initial_equity, startup_id)
      VALUES (?, ?, ?, ?, ?)
    `;

    db.query(query, [founder_id, name, role, equityNum, startup_id], (err) => {
      if (err) {
        console.error("❌ FULL ERROR:", err);
        return res.status(500).send(err.sqlMessage);
      }

      res.send("Founder added successfully");
    });
  });
});
app.get("/founders", (req, res) => {
  const query = `
    SELECT 
      f.founder_name, 
      f.founder_role, 
      f.initial_equity, 
      s.startup_name
    FROM FOUNDER f
    LEFT JOIN STARTUP s ON f.startup_id = s.startup_id
  `;

  db.query(query, (err, result) => {
    if (err) {
      console.error("Fetch Founder Error:", err);
      return res.status(500).send("Error fetching founders");
    }
    res.json(result);
  });
});

// ================= FUNDING ROUND APIs =================
app.post("/addFunding", (req, res) => {
  const { startup_id, round_type, round_date, valuation, amount } = req.body;

  const round_id = "R" + Date.now();

  const query = `
    INSERT INTO FUNDING_ROUND
    (round_id, round_type, round_date, valuation, total_amount_raised, startup_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [round_id, round_type, round_date, valuation, amount, startup_id],
    (err) => {
      if (err) {
        console.error("Funding Error:", err);
        return res.status(500).send("Error adding funding");
      }

      res.send("Funding round added");
    },
  );
});

app.get("/funding", (req, res) => {
  const query = `
    SELECT f.*, s.startup_name 
    FROM FUNDING_ROUND f
    JOIN STARTUP s ON f.startup_id = s.startup_id
  `;

  db.query(query, (err, result) => {
    if (err) {
      console.error("Fetch Funding Error:", err);
      return res.status(500).send("Error fetching funding");
    }

    res.json(result);
  });
});

// ================= INVESTOR MANAGEMENT APIs =================
app.post("/addInvestor", (req, res) => {
  const { name, firm, type, country } = req.body;

  const investor_id = "I" + Date.now();

  const query = `
    INSERT INTO INVESTOR
    (investor_id, investor_name, firm_name, investor_type, country)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(query, [investor_id, name, firm, type, country], (err) => {
    if (err) {
      console.error("Investor Error:", err);
      return res.status(500).send("Error adding investor");
    }

    res.send("Investor added");
  });
});

app.get("/investors", (req, res) => {
  db.query("SELECT * FROM INVESTOR", (err, result) => {
    if (err) {
      console.error("Fetch Investor Error:", err);
      return res.status(500).send("Error fetching investors");
    }

    res.json(result);
  });
});

// ================= INVESTMENT TRANSACTION APIs =================
app.post("/addInvestment", (req, res) => {
  const { investor_id, round_id, amount, equity } = req.body;

  const investment_id = "INV" + Date.now();

  // STEP 1: Insert investment
  const query = `
    INSERT INTO INVESTMENT
    (investment_id, investor_id, round_id, amount_invested, equity_acquired)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [investment_id, investor_id, round_id, amount, equity],
    (err) => {
      if (err) {
        console.error("Investment Error:", err);
        console.error("FULL ERROR:", err);
        return res.status(500).send(err.sqlMessage);
      }

      // STEP 2: Get startup_id
      db.query(
        "SELECT startup_id FROM FUNDING_ROUND WHERE round_id = ?",
        [round_id],
        (err, result) => {
          if (err) return res.status(500).send("Error fetching startup");

          const startup_id = result[0].startup_id;

          // STEP 3: Add investor to history
          const history_id = "EH" + Date.now();

          db.query(
            `INSERT INTO EQUITY_HISTORY
            (ownership_id, startup_id, round_id, stakeholder_type, stakeholder_id, equity_percentage)
            VALUES (?, ?, ?, 'Investor', ?, ?)`,
            [history_id, startup_id, round_id, investor_id, equity],
          );

          // STEP 4: Dilute founders
          db.query(
            "SELECT founder_id, initial_equity FROM FOUNDER WHERE startup_id = ?",
            [startup_id],
            (err, founders) => {
              founders.forEach((f) => {
                const diluted = f.initial_equity * (1 - equity / 100);

                db.query(
                  `INSERT INTO EQUITY_HISTORY
                  (ownership_id, startup_id, round_id, stakeholder_type, stakeholder_id, equity_percentage)
                  VALUES (?, ?, ?, 'Founder', ?, ?)`,
                  [
                    "EH" + Math.random(),
                    startup_id,
                    round_id,
                    f.founder_id,
                    diluted,
                  ],
                );
              });
            },
          );

          res.send("Investment + dilution done ✅");
        },
      );
    },
  );
});

// ================= CAP TABLE API =================
app.get("/captable/:startup_id", (req, res) => {
  const { startup_id } = req.params;

  const query = `
    SELECT 
      f.founder_name AS stakeholder,
      'Founder' AS type,
      f.initial_equity AS equity
    FROM FOUNDER f
    WHERE f.startup_id = ?

    UNION ALL

    SELECT 
      inv.investor_name AS stakeholder,
      'Investor' AS type,
      i.equity_acquired AS equity
    FROM INVESTMENT i
    JOIN INVESTOR inv ON i.investor_id = inv.investor_id
    JOIN FUNDING_ROUND fr ON i.round_id = fr.round_id
    WHERE fr.startup_id = ?
  `;

  db.query(query, [startup_id, startup_id], (err, result) => {
    if (err) return res.status(500).send("Error fetching cap table");
    res.json(result);
  });
});

// ================= EQUITY HISTORY API =================
app.get("/history/:startup_id", (req, res) => {
  const { startup_id } = req.params;

  const query = `
    SELECT 
      fr.round_type,
      fr.round_date,
      eh.stakeholder_type,
      eh.equity_percentage AS equity,
      CASE 
        WHEN eh.stakeholder_type = 'Founder' THEN f.founder_name
        ELSE i.investor_name
      END AS stakeholder_name
    FROM EQUITY_HISTORY eh
    JOIN FUNDING_ROUND fr ON eh.round_id = fr.round_id
    LEFT JOIN FOUNDER f ON eh.stakeholder_id = f.founder_id
    LEFT JOIN INVESTOR i ON eh.stakeholder_id = i.investor_id
    WHERE eh.startup_id = ?
    AND fr.round_date = (
      SELECT MAX(fr2.round_date)
      FROM FUNDING_ROUND fr2
      WHERE fr2.startup_id = ?
    )
  `;

  db.query(query, [startup_id, startup_id], (err, result) => {
    if (err) return res.status(500).send("Error fetching history");
    res.json(result);
  });
});

// ================= SERVER =================
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
