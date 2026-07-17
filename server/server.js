
const express = require("express");
const cors = require("cors");
require("./config/db");
const app = express();
const renewalRoutes = require("./routes/renewals");
const dashboardRoutes = require("./routes/dashboard");
app.use(cors());
app.use(express.json());
app.use("/api/renewals", renewalRoutes);
//app.use("/api/renewals", renewalsRoutes);
//app.use("/api/dashboard", dashboardRoutes);
//const renewalRoutes=require("./routes/renewalRoutes");

const contractRoutes=require("./routes/contracts");
app.use("/api/contracts",contractRoutes);



app.get("/", (req,res)=>{
    res.send("ContractIQ Backend Running");
});


const PORT = 5000;

app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
});