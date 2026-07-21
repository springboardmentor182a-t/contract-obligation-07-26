/*import React from "react";

function PageContainer({ children }) {
  return (
    <div
      style={{
        width: "100%",
        paddingTop: "10px"
      }}
    >
      {children}
    </div>
  );
}

export default PageContainer;*/
import React from "react";

function PageContainer({ children }) {
  return (
    <div
      style={{
        width: "100%",
        padding: "20px",
        minHeight: "100vh"
      }}
    >
      {children}
    </div>
  );
}

export default PageContainer;