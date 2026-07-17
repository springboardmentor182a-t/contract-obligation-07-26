import { useEffect, useState } from "react";

import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import DashboardCards from "../../components/DashboardCards/DashboardCards";
import Charts from "../../components/Charts/Charts";
import RenewalTable from "../../components/RenewalTable/RenewalTable";

import { getRenewals } from "../../services/renewalService";
//import AddRenewalModal from "../../components/AddRenewalModal/AddRenewalModal";
import "./Renewals.css";

const Renewals = () => {

  const [renewals,setRenewals] = useState([]);


//const [showModal, setShowModal] = useState(false);
  useEffect(()=>{

    loadRenewals();

  },[]);



  const loadRenewals = async()=>{

    try{

      const data = await getRenewals();
      setRenewals(data);

    }
    catch(error){

      console.log("Error loading renewals",error);

    }

  };

//const [showModal, setShowModal] = useState(false);
  return (
    <div className="dashboard">

      <Sidebar />


      <div className="dashboard-content">

        <Navbar />


        <div className="dashboard-header">

          <div className="header-left">

            <h1>
              Renewals Dashboard
            </h1>


            <p>
              Overview of all renewable contracts and their renewal status.
            </p>

          </div>



          <div className="header-right">

            <button className="settings-btn">
              ⚙ Renewal Settings
            </button>


            <button className="date-btn">
              📅 01 May 2024 - 01 May 2025
            </button>
       

          </div>


        </div>



        <DashboardCards renewals={renewals}/>


        <Charts renewals={renewals}/>


        <RenewalTable renewals={renewals}/>


      </div>


    </div>
  );
 
};


export default Renewals;