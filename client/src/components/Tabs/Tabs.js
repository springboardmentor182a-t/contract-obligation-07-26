import "../../styles/details.css";

function Tabs() {
  return (
    <div className="details-tabs">

      <button className="active">Overview</button>

      <button>Obligations</button>

      <button>Documents</button>

      <button>Tasks</button>

      <button>History</button>

      <button>Notes</button>

    </div>
  );
}

export default Tabs;