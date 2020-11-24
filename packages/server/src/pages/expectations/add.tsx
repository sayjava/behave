export default () => {
  return (
    <main>
      <h1>New Expectation</h1>
      <div>
        <div>
          <h3>Request</h3>
          <form action="/_/ui/expectation">
            <div>
              <label htmlFor="path">Path</label>
              <input id="path" name="path" type="text" />
            </div>
            <div>
              <label htmlFor="method">Method</label>
              <select name="method" id="method">
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
              </select>
            </div>
            <div>
              <label htmlFor="headers">Headers</label>
              <div>Headers</div>
            </div>
            <div>
              <label htmlFor="pathParams">Path Params</label>
              <div>Params</div>
            </div>
            <div>
              <label htmlFor="queryParams">Query Params</label>
              <div>Query Params</div>
            </div>
            <div>
              <input type="submit" value="submit" />
            </div>
          </form>
        </div>
        <div>
          <h3>Response</h3>
          <form action="/_/ui/expectation">
            <div>
              <label htmlFor="path">Status Code</label>
              <input id="statusCode" name="statusCode" type="text" />
            </div>
            <div>
              <label htmlFor="headers">Headers</label>
              <div>Headers</div>
            </div>
            <div>
              <label htmlFor="body">Body</label>
              <textarea id="body" name="body"></textarea>
            </div>
            <div>
              <input type="submit" value="submit" />
            </div>
          </form>
        </div>
        <div>
          <h3>Expectation Options</h3>
          <form action="/_/ui/expectation">
            <div>
              <label htmlFor="name">Name</label>
              <input id="name" name="name" type="text" />
            </div>
            <div>
              <label htmlFor="description">Description</label>
              <textarea id="description" name="description" rows="10" />
            </div>
            <div>
              <label htmlFor="count">Count</label>
              <input id="count" name="count" type="number" />
            </div>
            <div>
              <label htmlFor="ttl">Time To Live (In seconds)</label>
              <input id="ttl" name="timeToLive" type="number" />
            </div>
            <div>
              <label htmlFor="priority">Priority</label>
              <input id="priority" name="priority" type="number" />
            </div>
            <div>
              <label htmlFor="delay">Delay</label>
              <input id="delay" name="delay" type="number" />
            </div>
            <div>
              <input type="submit" value="submit" />
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};
