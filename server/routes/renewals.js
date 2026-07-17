/*const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// GET all renewals
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM renewals ORDER BY id ASC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// POST a new renewal
router.post("/", async (req, res) => {
  try {
    const {
      contract_id,
      renewal_date,
      reminder_days,
      status,
    } = req.body;

    /*const result = await pool.query(
      `INSERT INTO renewals
      (contract_id, renewal_date, reminder_days, status)
      VALUES ($1, $2, $3, $4)
      RETURNING *`,
      [contract_id, renewal_date, reminder_days, status]
    );






const result = await pool.query(`
  SELECT
    renewals.id,
    contracts.contract_name,
    contracts.client_name,
    renewals.renewal_date,
    renewals.reminder_days,
    renewals.status
  FROM renewals
  JOIN contracts
    ON renewals.contract_id = contracts.id
  ORDER BY renewals.id ASC
`);




    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router; */





/*
// GET all renewals
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        renewals.id,
        contracts.contract_name,
        contracts.client_name,
        renewals.renewal_date,
        renewals.reminder_days,
        renewals.status
      FROM renewals
      JOIN contracts
      ON renewals.contract_id = contracts.id
      ORDER BY renewals.id ASC
    `);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});*/



const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// GET all renewals
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        renewals.id,
        contracts.contract_name,
        contracts.client_name,
        renewals.renewal_type,
        renewals.renewal_date,
        renewals.reminder_days,
        renewals.status
      FROM renewals
      JOIN contracts
        ON renewals.contract_id = contracts.id
      ORDER BY renewals.id ASC
    `);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});
// POST a new renewal
/*router.post("/", async (req, res) => {
  try {
    const {
      contract_id,
      renewal_date,
      reminder_days,
      status,
    } = req.body;

    const result = await pool.query(
      `INSERT INTO renewals
      (contract_id, renewal_date, reminder_days, status)
      VALUES ($1, $2, $3, $4)
      RETURNING *`,
      [contract_id, renewal_date, reminder_days, status]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;*/
router.post("/", async (req, res) => {
  try {
    const {
      contract_id,
      renewal_type,
      renewal_date,
      reminder_days,
      status,
    } = req.body;

    const result = await pool.query(
      `INSERT INTO renewals
      (
        contract_id,
        renewal_type,
        renewal_date,
        reminder_days,
        status
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *`,
      [
        contract_id,
        renewal_type,
        renewal_date,
        reminder_days,
        status,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("ERROR:", err);
    console.error("MESSAGE:", err.message);
    console.error("DETAIL:", err.detail);
    console.error("CODE:", err.code);

    res.status(500).json({
      message: err.message,
      detail: err.detail,
    });
  }
});

module.exports = router;
// UPDATE renewal
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const {
      renewal_type,
      renewal_date,
      reminder_days,
      status,
    } = req.body;

    const result = await pool.query(
      `
      UPDATE renewals
      SET
        renewal_type=$1,
        renewal_date=$2,
        reminder_days=$3,
        status=$4
      WHERE id=$5
      RETURNING *
      `,
      [
        renewal_type,
        renewal_date,
        reminder_days,
        status,
        id,
      ]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: err.message,
    });
  }
});