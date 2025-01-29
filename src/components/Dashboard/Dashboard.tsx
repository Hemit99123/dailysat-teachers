import React from "react";
import TopBar from "./TopBar";
import AllStudentsView from "./AllStudentsView";

export const Dashboard = () => {
  return (
    <div className="bg-white rounded-lg pb-4 shadow">
      <TopBar />
      <AllStudentsView />
    </div>
  );
};
