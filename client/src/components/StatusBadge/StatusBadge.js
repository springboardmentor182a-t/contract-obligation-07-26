function StatusBadge({ status }) {

  let className = "badge";

  if (status === "Active") className += " success";

  if (status === "Review") className += " warning";

  if (status === "Draft") className += " draft";

  return (

    <span className={className}>

      {status}

    </span>

  );

}

export default StatusBadge;