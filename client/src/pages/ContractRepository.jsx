import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/Header/Header";
import SearchBar from "../../components/SearchBar/SearchBar";
import ContractTable from "../../components/ContractTable/ContractTable";

import {
  FiFileText,
  FiCheckCircle,
  FiClock,
  FiShield
} from "react-icons/fi";

import "../../styles/repository.css";

const cards = [
  {
    icon: <FiFileText />,
    title: "Total Contracts",
    value: "128",
    sub: "All Time",
    color: "#ede9fe"
  },
  {
    icon: <FiCheckCircle />,
    title: "Active Contracts",
    value: "86",
    sub: "Currently Active",
    color: "#dcfce7"
  },
  {
    icon: <FiClock />,
    title: "Expiring Soon",
    value: "18",
    sub: "Next 90 Days",
    color: "#fef3c7"
  },
  {
    icon: <FiShield />,
    title: "Compliance",
    value: "78%",
    sub: "Overall Score",
    color: "#dbeafe"
  }
];

function ContractRepository() {

  return (

    <div className="repository">

      <Sidebar />

      <div className="main-content">

        <Header />

        <div className="repository-body">

          <div className="page-heading">

            <h1>Contract Repository</h1>

            <p>

              Manage and monitor all your contracts in one place.

            </p>

          </div>

          {/* Summary Cards */}

          <div className="stats-grid">

            {

              cards.map((card) => (

                <div className="stat-card" key={card.title}>

                  <div
                    className="stat-icon"
                    style={{ background: card.color }}
                  >

                    {card.icon}

                  </div>

                  <div>

                    <h4>{card.title}</h4>

                    <h2>{card.value}</h2>

                    <span>{card.sub}</span>

                  </div>

                </div>

              ))

            }

          </div>

          {/* Tabs */}

          <div className="repository-top">

            <div className="tabs">

              <button className="active">

                All

              </button>

              <button>

                Active

              </button>

              <button>

                Expiring

              </button>

              <button>

                Archived

              </button>

            </div>

            <div className="top-buttons">

              <button className="export">

                Export

              </button>

              <button className="new-contract">

                + New Contract

              </button>

            </div>

          </div>

          <SearchBar />

          <ContractTable />

        </div>

      </div>

    </div>

  );

}

export default ContractRepository;