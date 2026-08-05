import { AlertTriangle, Clock } from "lucide-react";

function badgeClass(priority) {
  switch (priority) {
    case "Critical":
      return "priority-badge priority-critical";
    case "High":
      return "priority-badge priority-high";
    case "Medium":
      return "priority-badge priority-medium";
    default:
      return "priority-badge priority-low";
  }
}

export default function PriorityTasks({
  data = [],
  onReview,
}) {
  return (
    <div className="section-card priority-task-card">

      <div className="section-header">
        <h3 className="section-heading">
          <AlertTriangle size={18} />
          AI Priority Tasks
        </h3>

        <span className="control-count-badge">
          {data.length} Task{data.length !== 1 ? "s" : ""}
        </span>
      </div>

      {data.length === 0 ? (
        <div className="empty-state">
          No priority tasks available.
        </div>
      ) : (
        <div className="priority-task-list">

          {data.map((task) => (

            <div
              key={task.contract_id}
              className={`priority-item ${task.priority.toLowerCase()}`}
            >

              <div className="priority-item-top">

                <div>

                  <div className="priority-contract">
                    {task.contract_name}
                  </div>

                  <div className="priority-vendor">
                    {task.vendor}
                  </div>

                </div>

                <span className={badgeClass(task.priority)}>
                  {task.priority}
                </span>

              </div>

              <div className="priority-reason">
                {task.reason}
              </div>

              <div className="priority-footer">

                <div className="priority-deadline">
                  <Clock size={15} />
                  {task.days_left !== null
                    ? `${task.days_left} day(s) left`
                    : "No deadline"}
                </div>

                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => onReview?.(task)}
                >
                  Review
                </button>

              </div>

            </div>

          ))}

        </div>
      )}

    </div>
  );
}