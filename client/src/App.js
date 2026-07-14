import React from "react";
import { Routes, Route } from "react-router-dom";

import ContractRepository from "./pages/ContractRepository/ContractRepository";
import ContractDetails from "./pages/ContractDetails/ContractDetails";
import AddContract from "./pages/AddContract/AddContract";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<ContractRepository />}
      />

      <Route
        path="/contract-details/:id"
        element={<ContractDetails />}
      />

      <Route
        path="/add-contract"
        element={<AddContract />}
      />

      <Route
        path="/edit-contract/:id"
        element={<AddContract />}
      />
    </Routes>
  );
}

export default App;