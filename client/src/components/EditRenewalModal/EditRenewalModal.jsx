import { useState } from "react";
import { updateRenewal } from "../../services/renewalService";
import "./EditRenewalModal.css";

const EditRenewalModal = ({ renewal, onClose, onSuccess }) => {

  const [formData, setFormData] = useState({

    renewal_type: renewal.renewal_type,

    renewal_date:
      renewal.renewal_date.substring(0,10),

    reminder_days: renewal.reminder_days,

    status: renewal.status

  });

  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]: e.target.value

    });

  };

  const handleSubmit = async(e)=>{

    e.preventDefault();

    try{

      await updateRenewal(renewal.id,formData);

      alert("Renewal Updated Successfully");

      onSuccess();

      onClose();

    }
    catch(error){

      console.log(error);

      alert("Update Failed");

    }

  };

  return (

    <div className="modal-overlay">

      <div className="modal">

        <h2>Edit Renewal</h2>

        <form onSubmit={handleSubmit}>

          <select
            name="renewal_type"
            value={formData.renewal_type}
            onChange={handleChange}
          >

            <option>Automatic</option>

            <option>Manual</option>

          </select>

          <input

            type="date"

            name="renewal_date"

            value={formData.renewal_date}

            onChange={handleChange}

          />

          <input

            type="number"

            name="reminder_days"

            value={formData.reminder_days}

            onChange={handleChange}

          />

          <select

            name="status"

            value={formData.status}

            onChange={handleChange}

          >

            <option>Pending</option>

            <option>Completed</option>

          </select>

          <button type="submit">

            Update Renewal

          </button>

        </form>

      </div>

    </div>

  );

};

export default EditRenewalModal;