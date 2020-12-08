import { useState, useEffect } from "react";
import RecordView from "./RecordView";

const Records = () => {
  const [records, setRecords] = useState([]);
  const [selected, selectRecord] = useState({} as any);

  const terminalKlass = `coding inverse-toggle shadow-lg text-gray-100 text-sm font-mono subpixel-antialiased 
              pb-6 pt-4 rounded-sm leading-normal overflow-hidden`;

  useEffect(() => {
    fetch("/_/api/records").then(async (res) => {
      const records = await res.json();
      setRecords(records.sort((a: any, b: any) => b.timestamp - a.timestamp));
    });
  }, []);

  const toggle = (e, record) => {
    if (selected.timestamp === record.timestamp) {
      return selectRecord({});
    }

    return selectRecord(record);
  };

  return (
    <div
      className={terminalKlass}
      style={{ backgroundColor: "rgb(16, 16, 16)" }}
    >
      {records.map((record: any) => {
        return (
          <div
            key={record.timestamp}
            className="cursor-pointer"
            onClick={(e) => toggle(e, record)}
          >
            <RecordView
              record={record}
              selected={selected.timestamp === record.timestamp}
            />
          </div>
        );
      })}
    </div>
  );
};

export default Records;
