import { useState, useEffect } from "react";
import BehaviorView from "./BehaviorView";

const Behaviors = () => {
  const [expectations, setExpectations] = useState<any[]>([]);
  useEffect(() => {
    fetch("/_/api/expectations").then(async (res) => {
      const expectations = await res.json();
      setExpectations(expectations);
    });
  }, []);

  return (
    <div>
      {expectations.map((exp) => {
        return <BehaviorView exp={exp} key={exp.id} />;
      })}
    </div>
  );
};

export default Behaviors;
