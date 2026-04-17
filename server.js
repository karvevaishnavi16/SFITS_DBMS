// ================= IMPORTS =================
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ================= DB =================
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root123",
  database: "SFITS_DBMS_PRJ",
});

db.connect((err) => {
  if (err) return console.error(err);
  console.log("MySQL Connected");

  function ensureColumn(tableName, columnName, alterSql) {
    db.query(
      `SHOW COLUMNS FROM ${tableName} LIKE ?`,
      [columnName],
      (showErr, showRes) => {
        if (showErr) {
          return console.warn(
            `Unable to inspect ${tableName} columns:`,
            showErr.sqlMessage || showErr.message,
          );
        }

        if (!showRes || showRes.length === 0) {
          db.query(alterSql, (alterErr) => {
            if (alterErr) {
              return console.error(
                `Failed to add ${tableName}.${columnName}:`,
                alterErr.sqlMessage || alterErr.message,
              );
            }
            console.log(`Added missing ${tableName}.${columnName} column`);
          });
        }
      },
    );
  }

  ensureColumn(
    "FOUNDER",
    "founder_email",
    "ALTER TABLE FOUNDER ADD COLUMN founder_email VARCHAR(100) NULL",
  );

  ensureColumn(
    "FOUNDER",
    "user_id",
    "ALTER TABLE FOUNDER ADD COLUMN user_id INT NULL",
  );

  ensureColumn(
    "INVESTOR",
    "user_id",
    "ALTER TABLE INVESTOR ADD COLUMN user_id INT NULL",
  );

  ensureColumn(
    "STARTUP",
    "user_id",
    "ALTER TABLE STARTUP ADD COLUMN user_id INT NULL",
  );

  // Seed INDUSTRY table if empty///////////////////////
  db.query("SELECT COUNT(*) AS cnt FROM INDUSTRY", (err, res) => {
    if (err) return console.warn("Could not check INDUSTRY table:", err.message);
    if (res[0].cnt === 0) {
      db.query(
        `INSERT IGNORE INTO INDUSTRY (industry_id, industry_name) VALUES
         ('I001','FinTech'),('I002','HealthTech'),('I003','EdTech')`,
        (insertErr) => {
          if (insertErr) return console.error("Industry seed failed:", insertErr.message);
          console.log("Seeded INDUSTRY table");
        }
      );
    }
  });
});
////////////////////////////

function isValidEmail(email) {
  return typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ================= HELPER =================
function generateId(prefix) {
  return prefix + Math.floor(1000 + Math.random() * 9000);
}

// ================= AUTH =================
app.post("/signup", (req, res) => {
  const { username, email, password, role } = req.body;

  if (!isValidEmail(email)) {
    return res.status(400).send("Invalid email address.");
  }

  db.query(
    "INSERT INTO USERS (username, email, password, role) VALUES (?, ?, ?, ?)",
    [username, email, password, role],
    (err) => {
      if (err) return res.status(500).send(err.sqlMessage);
      res.send("Signup successful");
    },
  );
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!isValidEmail(email)) {
    return res.status(400).send("Invalid email address.");
  }

  db.query(
    `SELECT u.*, i.investor_id
     FROM USERS u
     LEFT JOIN INVESTOR i ON u.user_id = i.user_id
     WHERE u.email = ? AND u.password = ?`,
    [email, password],
    (err, result) => {
      if (err) return res.status(500).send(err.sqlMessage || "Login failed");

      if (result.length === 0) return res.status(401).send("Invalid");

      const user = result[0];

      if (user.email) {
        db.query(
          "UPDATE FOUNDER SET user_id = ? WHERE TRIM(LOWER(founder_email)) = TRIM(LOWER(?)) AND user_id IS NULL",
          [user.user_id, user.email],
          (updateErr) => {
            if (updateErr)
              console.warn("Founder auto-link failed:", updateErr.sqlMessage);
          },
        );
      }

      res.json({
        user_id: user.user_id,
        username: user.username,
        role: user.role,
        investor_id: user.investor_id,
      });
    },
  );
});

// ================= STARTUPS =================
app.post("/addStartup", (req, res) => {
  const {
    startup_name,
    founded_year,
    stage,
    industry_id,
    city,
    state,
    country,
    user_id,
  } = req.body;

  const startup_id = generateId("S");

  db.query(
    `INSERT INTO STARTUP VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      startup_id,
      startup_name,
      founded_year,
      stage,
      city,
      state,
      country,
      industry_id,
      user_id,
    ],
    (err) => {
      if (err) return res.status(500).send(err.sqlMessage);
      res.send("Startup added");
    },
  );
});

// ✅ RESTORED
app.get("/startups/:user_id", (req, res) => {
  db.query(
    `SELECT DISTINCT s.*
     FROM STARTUP s
     LEFT JOIN FOUNDER f ON s.startup_id = f.startup_id
     LEFT JOIN USERS u2 ON TRIM(LOWER(u2.email)) = TRIM(LOWER(f.founder_email))
     WHERE s.user_id = ? OR f.user_id = ? OR u2.user_id = ?`,
    [req.params.user_id, req.params.user_id, req.params.user_id],
    (err, result) => {
      if (err) return res.status(500).send(err.sqlMessage);
      res.json(result);
    },
  );
});

// ================= FOUNDERS =================
app.post("/addFounder", (req, res) => {
  const { founders, startup_id } = req.body;

  if (!Array.isArray(founders) || founders.length === 0) {
    return res.status(400).send("No founders provided");
  }

  let totalNewEquity = 0;

  for (const founder of founders) {
    const equity = Number(founder.equity);
    if (Number.isNaN(equity) || equity <= 0) {
      return res.status(400).send("Founder equity must be a positive number");
    }

    totalNewEquity += equity;
  }

  if (totalNewEquity > 100) {
    return res
      .status(400)
      .send("Total equity for new founders cannot exceed 100%");
  }

  db.query(
    "SELECT COALESCE(SUM(initial_equity), 0) AS existing_total FROM FOUNDER WHERE startup_id=?",
    [startup_id],
    (err, existingRes) => {
      if (err) return res.status(500).send(err.sqlMessage);

      const existingTotal = existingRes[0]?.existing_total || 0;
      if (existingTotal + totalNewEquity > 100) {
        return res.status(400).send("Total founder equity cannot exceed 100%");
      }

      db.query("SELECT NOW() as now", (err, timeRes) => {
        if (err) return res.status(500).send(err.sqlMessage);

        const snapshotTime = timeRes[0].now;

        // 🔥 STEP 1: GET OR CREATE ROUND (ONLY ONCE)
        db.query(
          "SELECT round_id FROM FUNDING_ROUND WHERE startup_id=? ORDER BY round_date DESC LIMIT 1",
          [startup_id],
          (err, roundRes) => {
            if (err) return res.status(500).send(err.sqlMessage);

            let round_id;

            if (roundRes.length === 0) {
              round_id = generateId("R");

              db.query(
                `INSERT INTO FUNDING_ROUND 
             (round_id, round_type, round_date, valuation, total_amount_raised, startup_id)
             VALUES (?, 'Initial', CURDATE(), 0, 0, ?)`,
                [round_id, startup_id],
                (err2) => {
                  if (err2) return res.status(500).send(err2.sqlMessage);

                  insertAllFounders(round_id);
                },
              );
            } else {
              round_id = roundRes[0].round_id;
              insertAllFounders(round_id);
            }

            // 🔥 STEP 2: INSERT FOUNDERS + EQUITY
            function insertAllFounders(round_id) {
              let completed = 0;

              founders.forEach((f) => {
                const founder_id = generateId("F");

                // Link the founder to an existing user account by email so the co-founder
                // can see the startup when they log in.
                db.query(
                  "SELECT user_id FROM USERS WHERE TRIM(LOWER(email)) = TRIM(LOWER(?))",
                  [f.email],
                  (err1, userRes) => {
                    if (err1) return res.status(500).send(err1.sqlMessage);

                    const founderUserId =
                      userRes.length > 0 ? userRes[0].user_id : null;
                    const founderEmail = f.email || null;

                    db.query(
                      `INSERT INTO FOUNDER 
                   (founder_id, founder_name, founder_email, founder_role, initial_equity, startup_id, user_id)
                   VALUES (?, ?, ?, ?, ?, ?, ?)`,
                      [
                        founder_id,
                        f.name,
                        founderEmail,
                        f.role,
                        f.equity,
                        startup_id,
                        founderUserId,
                      ],
                      (err2) => {
                        if (err2) return res.status(500).send(err2.sqlMessage);

                        // ✅ insert into EQUITY_HISTORY (FIXED)
                        db.query(
                          `INSERT INTO EQUITY_HISTORY
                       (ownership_id, startup_id, round_id, stakeholder_type, stakeholder_id, equity_percentage, recorded_at)
                       VALUES (?, ?, ?, 'Founder', ?, ?, ?)`,
                          [
                            generateId("H"),
                            startup_id,
                            round_id, // ✅ dynamic (NO R0)
                            founder_id,
                            f.equity,
                            snapshotTime,
                          ],
                          (err3) => {
                            if (err3)
                              return res.status(500).send(err3.sqlMessage);

                            completed++;

                            if (completed === founders.length) {
                              res.send("All founders added");
                            }
                          },
                        );
                      },
                    );
                  },
                );
              });
            }
          },
        );
      });
    },
  );
});

// ✅ RESTORED
app.get("/founders/:user_id", (req, res) => {
  db.query(
    `SELECT DISTINCT f.*, s.startup_name, COALESCE(u.email, f.founder_email) AS founder_email
     FROM FOUNDER f
     JOIN STARTUP s ON f.startup_id = s.startup_id
     LEFT JOIN USERS u ON f.user_id = u.user_id
     LEFT JOIN USERS u2 ON TRIM(LOWER(u2.email)) = TRIM(LOWER(f.founder_email))
     WHERE s.user_id = ?
       OR f.user_id = ?
       OR u2.user_id = ?`,
    [req.params.user_id, req.params.user_id, req.params.user_id],
    (err, result) => {
      if (err) return res.status(500).send(err.sqlMessage);
      res.json(result);
    },
  );
});

// ================= FUNDING =================
app.post("/addFunding", (req, res) => {
  const { startup_id, round_type, round_date, valuation, total_amount_raised } =
    req.body;

  const round_id = generateId("R");

  db.query(
    `INSERT INTO FUNDING_ROUND VALUES (?, ?, ?, ?, ?, ?)`,
    [
      round_id,
      round_type,
      new Date(round_date).toISOString().slice(0, 10),
      valuation,
      total_amount_raised,
      startup_id,
    ],
    (err) => {
      if (err) return res.status(500).send(err.sqlMessage);
      res.send("Funding added");
    },
  );
});

// ✅ RESTORED
app.get("/funding/:user_id", (req, res) => {
  db.query(
    `SELECT f.*, s.startup_name
     FROM FUNDING_ROUND f
     JOIN STARTUP s ON f.startup_id = s.startup_id
     WHERE s.user_id = ?`,
    [req.params.user_id],
    (err, result) => {
      if (err) return res.status(500).send(err.sqlMessage);
      res.json(result);
    },
  );
});

// ================= INVESTMENT =================
app.post("/addInvestment", (req, res) => {
  const { round_id, user_id, username, firm_name, country, amount, equity } =
    req.body;

  const equityNum = Number(equity);

  console.log("Incoming Investment:", req.body);

  // 1️⃣ Get or create investor
  db.query(
    "SELECT investor_id FROM INVESTOR WHERE user_id=?",
    [user_id],
    (err, invRes) => {
      if (err) return res.status(500).send(err.sqlMessage);

      let investor_id;

      if (invRes.length === 0) {
        investor_id = generateId("I");

        db.query(
          `INSERT INTO INVESTOR 
           (investor_id, investor_name, firm_name, country, user_id)
           VALUES (?, ?, ?, ?, ?)`,
          [
            investor_id,
            username || "Investor",
            firm_name || "Individual",
            country || "India",
            user_id,
          ],
          (err2) => {
            if (err2) return res.status(500).send(err2.sqlMessage);
            proceed(investor_id);
          },
        );
      } else {
        investor_id = invRes[0].investor_id;
        proceed(investor_id);
      }

      // ================= MAIN LOGIC =================
      function proceed(investor_id) {
        db.query(
          "SELECT startup_id FROM FUNDING_ROUND WHERE round_id=?",
          [round_id],
          (err, r) => {
            if (err) return res.status(500).send(err.sqlMessage);
            if (r.length === 0) return res.status(400).send("Invalid round");

            const startup_id = r[0].startup_id;

            // 🔥 ONE SNAPSHOT TIME FOR ALL
            db.query("SELECT NOW() as now", (err, timeRes) => {
              if (err) return res.status(500).send(err.sqlMessage);

              const snapshotTime = timeRes[0].now;

              // 2️⃣ Get last equity snapshot
              db.query(
                `SELECT stakeholder_id, stakeholder_type, equity_percentage
                  FROM (
                    SELECT *,
                          ROW_NUMBER() OVER (
                            PARTITION BY stakeholder_id
                            ORDER BY recorded_at DESC
                          ) as rn
                    FROM EQUITY_HISTORY
                    WHERE startup_id=?
                  ) t
                  WHERE rn = 1`,
                [startup_id],
                (err, lastData) => {
                  if (err) return res.status(500).send(err.sqlMessage);

                  const factor = (100 - equityNum) / 100;

                  console.log("Previous Equity:", lastData);

                  // ✅ FIRST INVESTMENT CASE
                  if (!lastData || lastData.length === 0) {
                    db.query(
                      "SELECT founder_id, initial_equity FROM FOUNDER WHERE startup_id=?",
                      [startup_id],
                      (err3, founders) => {
                        if (err3) return res.status(500).send(err3.sqlMessage);

                        if (!founders || founders.length === 0) {
                          insertInvestorHistory(insertInvestment);
                          return;
                        }

                        let founderInserts = 0;
                        founders.forEach((founder) => {
                          const dilutedEquity = founder.initial_equity * factor;
                          db.query(
                            `INSERT INTO EQUITY_HISTORY 
                             (ownership_id, startup_id, round_id, stakeholder_type, stakeholder_id, equity_percentage, recorded_at)
                             VALUES (?, ?, ?, 'Founder', ?, ?, ?)`,
                            [
                              generateId("H"),
                              startup_id,
                              round_id,
                              founder.founder_id,
                              Number(dilutedEquity.toFixed(4)),
                              snapshotTime,
                            ],
                            (err4) => {
                              if (err4)
                                return res.status(500).send(err4.sqlMessage);
                              founderInserts++;
                              if (founderInserts === founders.length) {
                                insertInvestorHistory(insertInvestment);
                              }
                            },
                          );
                        });
                      },
                    );
                  } else {
                    let completed = 0;
                    let investorHandled = false;

                    lastData.forEach((row) => {
                      let newEquity = row.equity_percentage * factor;

                      if (
                        row.stakeholder_type === "Investor" &&
                        row.stakeholder_id === investor_id
                      ) {
                        newEquity += equityNum; // add after dilution
                        investorHandled = true;
                      }

                      db.query(
                        `INSERT INTO EQUITY_HISTORY 
                         (ownership_id, startup_id, round_id, stakeholder_type, stakeholder_id, equity_percentage, recorded_at)
                         VALUES (?, ?, ?, ?, ?, ?, ?)`,
                        [
                          generateId("H"),
                          startup_id,
                          round_id,
                          row.stakeholder_type,
                          row.stakeholder_id,
                          Number(newEquity.toFixed(4)),
                          snapshotTime,
                        ],
                        (err4) => {
                          if (err4)
                            return res.status(500).send(err4.sqlMessage);

                          completed++;
                          if (completed === lastData.length) {
                            if (!investorHandled) {
                              insertInvestorHistory(insertInvestment);
                            } else {
                              insertInvestment();
                            }
                          }
                        },
                      );
                    });
                  }

                  function insertInvestorHistory(callback) {
                    db.query(
                      `INSERT INTO EQUITY_HISTORY 
                       (ownership_id, startup_id, round_id, stakeholder_type, stakeholder_id, equity_percentage, recorded_at)
                       VALUES (?, ?, ?, 'Investor', ?, ?, ?)`,
                      [
                        generateId("H"),
                        startup_id,
                        round_id,
                        investor_id,
                        equityNum,
                        snapshotTime,
                      ],
                      callback,
                    );
                  }

                  // ❌ REMOVED DUPLICATE INSERT (THIS WAS YOUR BUG)
                },
              );
            });
          },
        );
      }

      // 3️⃣ Store investment separately
      function insertInvestment() {
        db.query(
          `INSERT INTO INVESTMENT 
           (investment_id, round_id, investor_id, amount_invested, equity_acquired)
           VALUES (?, ?, ?, ?, ?)`,
          [generateId("INV"), round_id, investor_id, amount, equity],
          (err) => {
            if (err) return res.status(500).send(err.sqlMessage);

            res.send("Investment added successfully");
          },
        );
      }
    },
  );
});
// ================= CAP TABLE =================
app.get("/history/:startup_id", (req, res) => {
  db.query(
    `SELECT 
      eh.round_id,
      fr.round_type,
      fr.round_date,
      COALESCE(f.founder_name, i.investor_name) AS stakeholder,
      eh.stakeholder_type,
      eh.equity_percentage,
      eh.recorded_at
    FROM EQUITY_HISTORY eh
    LEFT JOIN FOUNDER f ON eh.stakeholder_id = f.founder_id
    LEFT JOIN INVESTOR i ON eh.stakeholder_id = i.investor_id
    LEFT JOIN FUNDING_ROUND fr ON eh.round_id = fr.round_id
    WHERE eh.startup_id = ?
    ORDER BY
      CASE fr.round_type
        WHEN 'Initial' THEN 0
        WHEN 'Pre-Seed' THEN 1
        WHEN 'Seed' THEN 2
        WHEN 'Series A' THEN 3
        WHEN 'Series B' THEN 4
        WHEN 'Series C' THEN 5
        ELSE 6
      END,
      fr.round_date ASC,
      eh.recorded_at ASC`,
    [req.params.startup_id],
    (err, result) => {
      if (err) return res.status(500).send(err.sqlMessage);
      res.json(result);
    },
  );
});

// ================= EXTRA (USED IN UI) =================
app.get("/allRounds", (req, res) => {
  db.query(
    `SELECT fr.round_id, fr.round_type, s.startup_name
     FROM FUNDING_ROUND fr
     JOIN STARTUP s ON fr.startup_id = s.startup_id
     JOIN (
       SELECT startup_id, MAX(round_date) AS max_date
       FROM FUNDING_ROUND
       GROUP BY startup_id
     ) latest ON fr.startup_id = latest.startup_id
       AND fr.round_date = latest.max_date
     ORDER BY s.startup_name`,
    (err, result) => {
      if (err) return res.status(500).send(err.sqlMessage);
      res.json(result);
    },
  );
});
app.get("/capTable/:startup_id", (req, res) => {
  const startup_id = req.params.startup_id;

  // ✅ Show current equity state for each stakeholder
  db.query(
    `SELECT
      COALESCE(f.founder_name, i.investor_name) AS stakeholder,
      eh.stakeholder_type,
      SUM(eh.equity_percentage) AS equity_percentage
    FROM (
      SELECT *,
        ROW_NUMBER() OVER (
          PARTITION BY stakeholder_id, stakeholder_type
          ORDER BY recorded_at DESC
        ) AS rn
      FROM EQUITY_HISTORY
      WHERE startup_id=?
    ) eh
    LEFT JOIN FOUNDER f ON eh.stakeholder_id = f.founder_id
    LEFT JOIN INVESTOR i ON eh.stakeholder_id = i.investor_id
    WHERE eh.rn = 1
    GROUP BY stakeholder, eh.stakeholder_type`,
    [startup_id],
    (err2, result) => {
      if (err2) return res.status(500).send(err2.sqlMessage);
      res.json(result);
    },
  );
});
// ================= GET INVESTOR =================
app.get("/getInvestor/:user_id", (req, res) => {
  db.query(
    "SELECT investor_id FROM INVESTOR WHERE user_id=?",
    [req.params.user_id],
    (err, result) => {
      if (err) return res.status(500).send(err.sqlMessage);

      if (result.length === 0) {
        return res.json({ investor_id: null });
      }

      res.json({ investor_id: result[0].investor_id });
    },
  );
});

// ================= MY INVESTMENTS =================
app.get("/myInvestments/:investor_id", (req, res) => {
  db.query(
    `SELECT 
      s.startup_name,
      fr.round_type,
      i.amount_invested,
      i.equity_acquired
     FROM INVESTMENT i
     JOIN FUNDING_ROUND fr ON i.round_id = fr.round_id
     JOIN STARTUP s ON fr.startup_id = s.startup_id
     WHERE i.investor_id = ?`,
    [req.params.investor_id],
    (err, result) => {
      if (err) return res.status(500).send(err.sqlMessage);
      res.json(result);
    },
  );
});
// ================= INVESTOR SUMMARY =================
app.get("/investorSummary/:investor_id", (req, res) => {
  db.query(
    `SELECT 
      SUM(amount_invested) AS total_invested,
      COUNT(DISTINCT fr.startup_id) AS total_startups,
      SUM(equity_acquired) AS total_equity
     FROM INVESTMENT i
     JOIN FUNDING_ROUND fr ON i.round_id = fr.round_id
     WHERE i.investor_id = ?`,
    [req.params.investor_id],
    (err, result) => {
      if (err) return res.status(500).send(err.sqlMessage);
      res.json(result[0]);
    },
  );
});

// ================= ALL STARTUPS =================
app.get("/allStartups", (req, res) => {
  db.query("SELECT * FROM STARTUP", (err, result) => {
    if (err) return res.status(500).send(err.sqlMessage);
    res.json(result);
  });
});
app.get("/startupDashboard/:startup_id", (req, res) => {
  const startup_id = req.params.startup_id;

  db.query(
    `SELECT 
      s.startup_name,
      s.stage,

      -- latest round
      (SELECT fr.round_type 
      FROM FUNDING_ROUND fr 
      WHERE fr.startup_id = s.startup_id 
      AND fr.round_type != 'Initial'
      ORDER BY fr.round_date DESC 
      LIMIT 1) AS latest_round,

      -- latest valuation
      (SELECT fr.valuation 
      FROM FUNDING_ROUND fr 
      WHERE fr.startup_id = s.startup_id 
      AND fr.valuation > 0
      ORDER BY fr.round_date DESC 
      LIMIT 1) AS valuation,

      -- ✅ CORRECT total funding
      (SELECT COALESCE(SUM(i.amount_invested),0)
      FROM INVESTMENT i
      JOIN FUNDING_ROUND fr ON i.round_id = fr.round_id
      WHERE fr.startup_id = s.startup_id
      ) AS total_funding,

      (SELECT COALESCE(SUM(fr.total_amount_raised),0)
      FROM FUNDING_ROUND fr
      WHERE fr.startup_id = s.startup_id
      AND fr.total_amount_raised > 0
      ) AS target_funding,

      -- ✅ CORRECT total investors
      (SELECT COUNT(DISTINCT i.investor_id)
      FROM INVESTMENT i
      JOIN FUNDING_ROUND fr ON i.round_id = fr.round_id
      WHERE fr.startup_id = s.startup_id
      ) AS total_investors,

      -- ✅ latest founder equity (your logic is good 👍)
      (
    SELECT COALESCE(SUM(equity_percentage),0)
    FROM (
      SELECT stakeholder_id, stakeholder_type, equity_percentage
      FROM (
        SELECT *,
              ROW_NUMBER() OVER (
                PARTITION BY stakeholder_id
                ORDER BY recorded_at DESC
              ) as rn
        FROM EQUITY_HISTORY
        WHERE startup_id = s.startup_id
      ) t
      WHERE rn = 1 AND stakeholder_type = 'Founder'
    ) latest
  ) AS founder_equity

    FROM STARTUP s
    WHERE s.startup_id = ?;`,
    [startup_id],
    (err, result) => {
      if (err) return res.status(500).send(err.sqlMessage);

      console.log("Dashboard Data:", result[0]); // 🔥 DEBUG

      res.json(result[0]);
    },
  );
});

// ================= SERVER =================
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
