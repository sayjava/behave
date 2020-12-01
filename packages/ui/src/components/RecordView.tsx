import { FiXCircle } from "react-icons/fi";
import JsonView from "react-json-view";

const RecordView = ({
  record,
  selected,
}: {
  record: any;
  selected: boolean;
}) => {
  const date = new Date(record.timestamp);
  const hasMatches = record.matches.length !== 0;
  const [matched] = record.matches;
  const { request } = record;

  const showBody = (request.method || "GET") === "GET" ? false : true;

  return (
    <div className="w-full">
      <div className="grid grid-cols-12 flex-nowrap overflow-hidden py-px items-center whitespace-no-wrap w-full">
        <div className="col-span-3">
          <div className="grid grid-flow-col gap-1 place-items-center">
            {selected && <div></div>}

            {!hasMatches && (
              <div className="text-red-400">
                <FiXCircle />
              </div>
            )}

            {hasMatches && (
              <div>
                <FiXCircle />
              </div>
            )}

            <div>
              {date.toDateString()} {date.toLocaleTimeString()}
            </div>
          </div>
        </div>
        <div className="col-span-1">{request.method}</div>
        <div className="col-span-3 truncate">{request.path}</div>

        <div className="col-span-5 truncate px-2">
          {!showBody && JSON.stringify(record.request.headers)}
          {showBody && JSON.stringify(record.request.body)}
        </div>
      </div>

      {selected && (
        <div className="px-8 py-6 grid grid-cols-2">
          <JsonView
            name="request"
            enableClipboard={false}
            displayObjectSize={false}
            displayDataTypes={false}
            src={request}
          />
          {matched && (
            <JsonView
              name="behavior"
              enableClipboard={false}
              displayObjectSize={false}
              displayDataTypes={false}
              src={matched}
            />
          )}
          {!matched && (
            <JsonView
              name="behavior"
              src={{ message: "No matched behavior" }}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default RecordView;
