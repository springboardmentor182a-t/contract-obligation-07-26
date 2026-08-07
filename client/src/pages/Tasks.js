import React, { useState } from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import Header from "../components/Header/Header";
import TaskHeader from "../components/tasks/TaskHeader";
import TaskCards from "../components/tasks/TaskCards";
import TaskTabs from "../components/tasks/TaskTabs";
import TaskFilters from "../components/tasks/TaskFilters";
import TaskSearch from "../components/tasks/TaskSearch";
import TaskTable from "../components/tasks/TaskTable";
import TaskPagination from "../components/tasks/TaskPagination";
import NewTaskModal from "../components/tasks/NewTaskModal";


function Tasks() {
  const [searchText, setSearchText] = useState("");
  const [activeTab, setActiveTab] = useState("All Tasks");
  const [filters, setFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const handleNewTask = () => {
    setShowNewTaskModal(true);
  };

  return (
    <div className="repository">
      <Sidebar />

      <div className="main-content">
        <Header />

        <div
          style={{
            padding: "25px",
            background: "#F8FAFC",
            minHeight: "100vh",
          }}
        >
      <TaskHeader onNewTask={handleNewTask} />

      <TaskCards refreshKey={refreshKey} />

      <TaskTabs
        onTabChange={(tab) => {
          setActiveTab(tab);
        }}
      />

      <TaskFilters
        onFilterChange={(data) => {
          setFilters(data);
        }}
      />

      <TaskSearch
        onSearch={(value) => {
          setSearchText(value);
        }}
      />

      <TaskTable
        key={refreshKey}
        searchText={searchText}
        activeTab={activeTab}
        filters={filters}
        currentPage={currentPage}
        tasksPerPage={5}
        onTotalPagesChange={setTotalPages}
        onEdit={(task) => {
          setSelectedTask(task);
          setShowEditModal(true);
        }}
      />

      <TaskPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {showNewTaskModal && (
        <NewTaskModal
          onClose={() => setShowNewTaskModal(false)}
          onTaskAdded={() => {
            setRefreshKey((prev) => prev + 1);
            setShowNewTaskModal(false);
          }}
        />
      )}
      {showEditModal && (
        <NewTaskModal
          editTask={selectedTask}
          onClose={() => setShowEditModal(false)}
          onTaskAdded={() => {
            setRefreshKey((prev) => prev + 1);
            setShowEditModal(false);
          }}
        />
      )}

        </div>
      </div>
    </div>
  );
}

export default Tasks;