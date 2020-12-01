import { useState, useEffect } from "react";
import RecordView from "./RecordView";

const Records = () => {
  const [records, setRecords] = useState([]);
  const [selected, selectRecord] = useState({} as any);

  useEffect(() => {
    fetch("/_/api/records").then(async (res) => {
      const records = await res.json();
      setRecords(records.sort((a: any, b: any) => b.timestamp - a.timestamp));
    });
  }, []);

  const recordKlass = (rec) => {
    const klass =
      "hover:bg-gray-100 text-gray-400 cursor-pointer border-b-2 border-gray-100 text-sm py-2";
    if (selected.timestamp === rec.timestamp) {
      return `${klass} bg-gray-200`;
    }

    return klass;
  };

  return (
    <div className="bg-white rounded-sm border border-gray-200">
      {records.map((record: any) => {
        return (
          <div
            key={record.timestamp}
            className={recordKlass(record)}
            onClick={() => selectRecord(record)}
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
