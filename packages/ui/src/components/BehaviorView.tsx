import { useState } from "react";

const BehaviorView = ({ exp }: { exp: any }) => {
  const [selected, setSelected] = useState(false);
  return (
    <div className="uk-card uk-card-small uk-card-default uk-card-body uk-margin-small">
      <dl
        className="uk-description-list"
        onClick={() => setSelected(!selected)}
      >
        <dt className="font-extrabold">{exp.name}</dt>
        <dd className="font-black">{exp.request.path}</dd>
      </dl>
      {selected && (
        <div>
          <div>
            <h5>Request</h5>
            <div>
              <dl className="uk-description-list">
                <dd>{exp.request.path}</dd>
                <dd>{exp.request.method || "GET"}</dd>
              </dl>
            </div>
          </div>
          <div>
            <h4>Response</h4>
            <p>{JSON.stringify(exp.response)}</p>
          </div>
          <dl>
            <dt>Limit</dt>
            <dd>{exp.limit || "unlimited"}</dd>
            <dt>Delay</dt>
            <dd>{exp.delay || "unlimited"}</dd>
          </dl>
        </div>
      )}
    </div>
  );
};

export default BehaviorView;
