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
    <div className="h-full w-full">
      <div className="h-full flex text-sm text-gray-400 flex-nowrap overflow-hidden items-center whitespace-no-wrap w-full py-1">
        <span className="inline-block truncate pl-4 min-w-min">
          {date.toDateString()} {date.toLocaleTimeString()}
        </span>

        {!hasMatches && (
          <span className="text-red-400 inline-block pl-4 w-12">
            {request.method}
          </span>
        )}

        {hasMatches && (
          <span className="inline-block pl-4 w-12">{request.method}</span>
        )}

        <span className="inline-block truncate pl-4">{request.path}</span>

        <div className="truncate px-2">
          {!showBody && JSON.stringify(record.request.headers)}
          {showBody && JSON.stringify(record.request.body)}
        </div>
      </div>

      {selected && (
        <div className="px-8 py-6 grid grid-cols-2">
          <JsonView
            name="request"
            theme="grayscale"
            enableClipboard={false}
            displayObjectSize={false}
            displayDataTypes={false}
            src={request}
          />
          {matched && (
            <JsonView
              name="behavior"
              theme="grayscale"
              enableClipboard={false}
              displayObjectSize={false}
              displayDataTypes={false}
              src={matched}
            />
          )}
          {!matched && (
            <JsonView
              name="behavior"
              theme="grayscale"
              src={{ message: "No matched behavior" }}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default RecordView;
