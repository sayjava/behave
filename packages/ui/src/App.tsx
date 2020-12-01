import React from "react";
import Records from "./components/Records";
import "./tailwind.output.css";
const App = () => {
  return (
    <main className="w-full bg-gray-100 py-16">
      <div className="container mx-auto h-full">
        <Records />
      </div>
    </main>
  );
};

export default App;
