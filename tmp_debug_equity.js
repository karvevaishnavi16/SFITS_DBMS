const mysql = require("mysql2");
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Trupti@2007",
  database: "SFITS_DBMS_PRJ",
});

db.connect((err) => {
  if (err) {
    console.error("CONNECT ERR", err);
    return;
  }

  db.query("SELECT startup_id,startup_name FROM STARTUP", (e, r) => {
    if (e) {
      console.error("STARTUP ERR", e);
      db.end();
      return;
    }
    console.log("STARTUPS", JSON.stringify(r, null, 2));

    db.query(
      "SELECT eh.*, f.founder_name, i.investor_name, fr.round_type, fr.round_date FROM EQUITY_HISTORY eh LEFT JOIN FOUNDER f ON eh.stakeholder_id=f.founder_id LEFT JOIN INVESTOR i ON eh.stakeholder_id=i.investor_id LEFT JOIN FUNDING_ROUND fr ON eh.round_id=fr.round_id ORDER BY eh.startup_id, fr.round_date, eh.recorded_at",
      (e2, r2) => {
        if (e2) {
          console.error("EQUITY_HISTORY ERR", e2);
          db.end();
          return;
        }
        console.log("EQUITY_HISTORY", JSON.stringify(r2, null, 2));
        db.end();
      },
    );
  });
});
