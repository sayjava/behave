import React from "react";
import Records from "./components/Records";
import "./tailwind.output.css";
const App = () => {
  return (
    <main className="w-full h-screen bg-gray-100 py-16">
      <div className="mx-auto h-full">
        <Records />
      </div>
    </main>
  );
};

export default App;
