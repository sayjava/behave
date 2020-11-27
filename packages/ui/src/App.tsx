import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";

const RecordView = ({ record }: { record: any }) => {
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
      setRecords(records.sort((a: any, b: any) => b.timestamp - a.timestamp));
    });
  }, []);

  return (
    <section>
      {records.map((record: any) => {
        return <RecordView record={record} key={record.timestamp} />;
      })}
    </section>
  );
};

const ExpectationView = ({ exp }: { exp: any }) => {
  const [selected, setSelected] = useState(false);
  return (
    <div>
      <div onClick={() => setSelected(!selected)}>
        <div>
          Name: {exp.name} : {exp.request.path}
        </div>
      </div>

      {selected && (
        <div>
          <div>Request: {JSON.stringify(exp.request)}</div>
          <div>Description: {exp.description}</div>
          <div>Response: {JSON.stringify(exp.response)}</div>
          <div>Limit: {exp.limit}</div>
          <div>Delay: {exp.delay}</div>
        </div>
      )}
    </div>
  );
};

const Expectations = () => {
  const [expectations, setExpectations] = useState<any[]>([]);
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

function App() {
  return (
    <div className="App">
      <Expectations />
      <Records />

      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
