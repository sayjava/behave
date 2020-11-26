import { useEffect, useState } from "react";
import Link from "next/link";
import { Expectation, Record } from "flyt-engine";

const RecordView = ({ record }: { record: Record }) => {
  const [selected, setSelected] = useState(false);
  const date = new Date(record.timestamp);

  return (
    <div>
      <div onClick={() => setSelected(!selected)}>
        <span>
          --- [{date.toDateString()}/{date.toLocaleTimeString()}]
        </span>
        <span>{record.request.method}</span>
        <span>{record.request.path}</span>
        <span>{record.matches.length}</span>
      </div>
      {selected && <div>{JSON.stringify(record.request)}</div>}
    </div>
  );
};

const Records = () => {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    fetch("/_/api/records").then(async (res) => {
      const records = await res.json();
      setRecords(records.sort((a, b) => b.timestamp - a.timestamp));
    });
  }, []);

  return (
    <section>
      {records.map((record) => {
        return <RecordView record={record} key={record.timestamp} />;
      })}
    </section>
  );
};

const ExpectationView = ({ exp }: { exp: Expectation }) => {
  return (
    <div>
      <div>Name: {exp.name}</div>
      <div>Description: {exp.description}</div>
      <div>Request: {JSON.stringify(exp.request)}</div>
      <div>Response: {JSON.stringify(exp.response)}</div>
      <div>Limit: {exp.limit}</div>
      <div>Delay: {exp.delay}</div>
    </div>
  );
};

const Expectations = () => {
  const [expectations, setExpectations] = useState<Expectation[]>([]);
  useEffect(() => {
    fetch("/_/api/expectations").then(async (res) => {
      const expectations = await res.json();
      setExpectations(expectations);
    });
  }, []);

  return (
    <section>
      {expectations.map((exp) => {
        return <ExpectationView exp={exp} key={exp.id} />;
      })}
    </section>
  );
};

export default () => {
  return (
    <div>
      <header>
        <Link href="expectations/add">
          <button>Add Expectation</button>
        </Link>
      </header>
      <main style={{ display: "flex" }}>
        <section>
          <h2>Records</h2>
          <Records />
        </section>
        <section>
          <h2>Expectations</h2>
          <Expectations />
        </section>
      </main>
    </div>
  );
};
