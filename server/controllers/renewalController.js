const pool = require("../config/db");


// GET ALL RENEWALS
exports.getRenewals = async (req, res) => {
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
            ORDER BY renewals.renewal_date ASC
        `);


        res.json(result.rows);

    } catch(error){

        console.log(error);
        res.status(500).json({
            message:"Server Error"
        });

    }
};



// CREATE RENEWAL
exports.createRenewal = async(req,res)=>{

    try{

        const {
            contract_id,
            renewal_type,
            renewal_date,
            reminder_days,
            status
        } = req.body;


        const result = await pool.query(
            `
            INSERT INTO renewals
            (
                contract_id,
                renewal_type,
                renewal_date,
                reminder_days,
                status
            )
            VALUES($1,$2,$3,$4,$5)
            RETURNING *
            `,
            [
                contract_id,
                renewal_type,
                renewal_date,
                reminder_days,
                status
            ]
        );


        res.json(result.rows[0]);


    }catch(error){

        console.log(error);

        res.status(500).json({
            message:"Unable to create renewal"
        });

    }

};



// UPDATE RENEWAL
exports.updateRenewal = async(req,res)=>{

    try{

        const {id}=req.params;

        const {
            renewal_type,
            renewal_date,
            reminder_days,
            status
        }=req.body;


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
            id
        ]);


        res.json(result.rows[0]);


    }catch(error){

        console.log(error);

        res.status(500).json({
            message:"Update failed"
        });

    }

};




// DELETE RENEWAL

// DELETE RENEWAL


const { id } = req.params;

console.log("Deleting ID:", id);

const check = await pool.query(
  "SELECT * FROM renewals WHERE id = $1",
  [id]
);

console.log("Found before delete:", check.rows);

console.log("Deleting ID:", id);

const check = await pool.query(
  "SELECT * FROM renewals WHERE id = $1",
  [id]
);

console.log("Found before delete:", check.rows);

    exports.deleteRenewal = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("Deleting ID:", id);

    const result = await pool.query(
      "DELETE FROM renewals WHERE id=$1 RETURNING *",
      [id]
    );

    console.log("Deleted rows:", result.rows);

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Renewal not found",
      });
    }

    res.json({
      message: "Deleted successfully",
    });

  } catch (error) {
    console.error("DELETE ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};