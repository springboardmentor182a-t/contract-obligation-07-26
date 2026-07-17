const express=require("express");

const router=express.Router();

const {
    getRenewals,
    createRenewal,
    updateRenewal,
    deleteRenewal

}=require("../controllers/renewalController");



router.get("/",getRenewals);

router.post("/",createRenewal);

router.put("/:id",updateRenewal);

router.delete("/:id",deleteRenewal);



module.exports=router;