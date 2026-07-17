import "./DashboardCards.css";

import {
  MdDescription,
  MdAutorenew,
  MdLoop,
  MdSchedule,
  MdWarning,
} from "react-icons/md";

//import renewalsData from "../../data/renewalsData";


//const DashboardCards = () => {
const DashboardCards = ({ renewals }) => {

  // Dynamic calculations

  /*const totalContracts = renewalsData.length;


  const automaticRenewals =
    renewalsData.filter(
      item => item.type === "Automatic"
    ).length;


  const manualRenewals =
    renewalsData.filter(
      item => item.type === "Manual"
    ).length;


  const renewingSoon =
    renewalsData.filter(
      item => item.daysLeft <= 30 && item.daysLeft > 0
    ).length;


  const overdue =
    renewalsData.filter(
      item => item.status === "Expired"
    ).length;*/

    // Dynamic calculations

const totalContracts = renewals.length;

const automaticRenewals = renewals.filter(
  item => item.renewal_type === "Automatic"
).length;

const manualRenewals = renewals.filter(
  item => item.renewal_type === "Manual"
).length;

const renewingSoon = renewals.filter(item => {
  const renewalDate = new Date(item.renewal_date);
  const today = new Date();

  const diffDays = Math.ceil(
    (renewalDate - today) / (1000 * 60 * 60 * 24)
  );

  return diffDays > 0 && diffDays <= 30;
}).length;

const overdue = renewals.filter(item => {
  return new Date(item.renewal_date) < new Date();
}).length;



  const cards = [

    {
      title:"Total Renewable Contracts",
      value: totalContracts,
      change:"+12%",
      icon:<MdDescription/>,
      color:"#6C63FF"
    },


    {
      title:"Automatic Renewal",
      value:automaticRenewals,
      change:"+8%",
      icon:<MdAutorenew/>,
      color:"#00C48C"
    },


    {
      title:"Manual Renewal",
      value:manualRenewals,
      change:"-2%",
      icon:<MdLoop/>,
      color:"#FFB648"
    },


    {
      title:"Renewing Soon",
      value:renewingSoon,
      change:"+5%",
      icon:<MdSchedule/>,
      color:"#4F8CFF"
    },


    {
      title:"Overdue Renewals",
      value:overdue,
      change:"-4%",
      icon:<MdWarning/>,
      color:"#FF4D6D"
    }

  ];




  return (

    <div className="cards-grid">


      {
        cards.map((card)=>(

          <div
          className="dashboard-card"
          key={card.title}
          >


            <div

            className="card-icon"

            style={{
              background:card.color
            }}

            >

              {card.icon}

            </div>



            <div className="card-content">


              <h4>
                {card.title}
              </h4>


              <h2>
                {card.value}
              </h2>


              <span>
                {card.change} this month
              </span>


            </div>



          </div>


        ))
      }



    </div>

  );

};


export default DashboardCards;