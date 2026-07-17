const express = require("express");
const router = express.Router();
const pool = require("../config/db");


// Renewal dashboard statistics
router.get("/renewals", async (req, res) => {

  try {

    // Total renewable contracts
    const total = await pool.query(`
      SELECT COUNT(*) 
      FROM renewals
    `);


    // Automatic renewals
    const automatic = await pool.query(`
      SELECT COUNT(*)
      FROM renewals
      WHERE renewal_type = 'Automatic'
    `);


    // Manual renewals
    const manual = await pool.query(`
      SELECT COUNT(*)
      FROM renewals
      WHERE renewal_type = 'Manual'
    `);


    // Renewing soon (next 30 days)
    const renewingSoon = await pool.query(`
      SELECT COUNT(*)
      FROM renewals
      WHERE renewal_date BETWEEN CURRENT_DATE 
      AND CURRENT_DATE + INTERVAL '30 days'
    `);


    // Overdue renewals
    const overdue = await pool.query(`
      SELECT COUNT(*)
      FROM renewals
      WHERE renewal_date < CURRENT_DATE
    `);



    res.json({

      totalRenewals: Number(total.rows[0].count),

      automaticRenewals:
        Number(automatic.rows[0].count),

      manualRenewals:
        Number(manual.rows[0].count),

      renewingSoon:
        Number(renewingSoon.rows[0].count),

      overdueRenewals:
        Number(overdue.rows[0].count)

    });


  } catch(err){

    console.error(err);

    res.status(500).json({
      message:"Dashboard Error"
    });

  }

});


module.exports = router;