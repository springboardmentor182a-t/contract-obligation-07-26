import { Routes, Route } from "react-router-dom";

function Home() {
  return (
    <div style={{ padding: "40px" }}>
      <h1>Contract Obligation Tracking Assistant</h1>
      <p>React project setup completed successfully.</p>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  );
}

export default App;