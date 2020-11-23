import { useEffect, useState } from "react";

const ShowExpectation = ({ exp }) => {
  return (
    <div>
      <div>
        <h2>{exp.name}</h2>
        <section>{exp.description}</section>
      </div>
      <div>
        <div>Count: {exp.count}</div>
        <div>Time to live: {exp.timeToLive}</div>
      </div>
      <div>
        <h3>Request</h3>
        <div>
          <div>Path: {exp.request.path}</div>
        </div>
        <div>
          <div>Method: {exp.request.method}</div>
        </div>
        <div>
          <div>Headers: {exp.request.headers}</div>
        </div>
        <div>
          <div>Body: {exp.request.body}</div>
        </div>
        <div>
          <div>Path Params: {exp.request.pathParams}</div>
        </div>
        <div>
          <div>Query Params: {exp.request.queryParams}</div>
        </div>
      </div>
      <div>
        <h3>Response</h3>
        <div>
          <div>Status Code: {exp.response.statusCode}</div>
        </div>
        <div>
          <div>Body: {JSON.stringify(exp.response.body)}</div>
        </div>
        <div>
          <div>Delay: {exp.response.delay}</div>
        </div>
        <div>
          <div>Headers: {exp.response.headers}</div>
        </div>
      </div>
    </div>
  );
};

export default () => {
  const [state, setState] = useState({
    expectations: [],
    busy: true,
    selected: null,
  });

  useEffect(() => {
    fetch("/_/api/expectations").then(async (res) => {
      const expectations = await res.json();
      setState({
        expectations,
        busy: false,
        selected: null,
      });
    });
  }, []);

  if (state.busy) {
    return (
      <main>
        <h3>Loading .....</h3>
      </main>
    );
  }

  const onExpectationSelected = (exp) => {
    setState(Object.assign({}, state, { selected: exp }));
  };

  return (
    <main>
      <h1>Expectations</h1>
      <div>
        <table>
          <thead>
            <tr>
              <td>Name</td>
              <td>Path</td>
              <td>Method</td>
              <td>Response</td>
              <td>Count</td>
              <td>Time To Live</td>
            </tr>
          </thead>
          <tbody>
            {state.expectations.map((exp) => {
              return (
                <tr key={exp.id} onClick={() => onExpectationSelected(exp)}>
                  <td>{exp.name}</td>
                  <td>{exp.request.path}</td>
                  <td>{exp.request.method || "GET"}</td>
                  <td>{exp.response.statusCode || 200}</td>
                  <td>{exp.count || "unlimited"}</td>
                  <td>{exp.timeToLive || "unlimited"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {state.selected && <ShowExpectation exp={state.selected} />}
    </main>
  );
};
