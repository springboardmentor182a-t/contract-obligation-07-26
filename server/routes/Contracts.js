const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// Get all contracts
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM contracts ORDER BY id ASC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Add contract
router.post("/", async (req, res) => {
  try {
    const {
      contract_name,
      client_name,
      start_date,
      end_date,
      status,
    } = req.body;

    const result = await pool.query(
      `INSERT INTO contracts
      (contract_name,client_name,start_date,end_date,status)
      VALUES($1,$2,$3,$4,$5)
      RETURNING *`,
      [
        contract_name,
        client_name,
        start_date,
        end_date,
        status,
      ]
    );

    res.status(201).json(result.rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// Update contract
router.put("/:id", async (req,res)=>{

  try{

    const {id}=req.params;

    const{
      contract_name,
      client_name,
      start_date,
      end_date,
      status
    }=req.body;

    const result=await pool.query(

      `UPDATE contracts
       SET
       contract_name=$1,
       client_name=$2,
       start_date=$3,
       end_date=$4,
       status=$5
       WHERE id=$6
       RETURNING *`,

       [
        contract_name,
        client_name,
        start_date,
        end_date,
        status,
        id
       ]

    );

    res.json(result.rows[0]);

  }catch(err){

    console.log(err);
    res.status(500).json({message:err.message});

  }

});

// Delete contract
router.delete("/:id",async(req,res)=>{

  try{

    const{id}=req.params;

    await pool.query(
      "DELETE FROM contracts WHERE id=$1",
      [id]
    );

    res.json({
      message:"Contract deleted"
    });

  }catch(err){

    console.log(err);
    res.status(500).json({message:err.message});

  }

});

module.exports=router;