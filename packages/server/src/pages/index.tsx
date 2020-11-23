import { useEffect } from "react";

export default () => {
  useEffect(() => {
    fetch("/_/api/expectations").then(async (res) => {
      const exps = await res.json();
      console.info("EXPECTATIONS ", exps);
    });
  });
  return (
    <div>
      <h1>FLYT engine UIx Next engine</h1>
    </div>
  );
};
