export interface Request {
  path: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "OPTION" | "PATCH";
  contentType?: "application/json" | "text/plain";
  body?:
    | string
    | {
        [key: string]: any;
      };

  headers: {
    [key: string]: any[];
  };
  pathParams?: {
    [key: string]: any[];
  };
  queryParams?: {
    [key: string]: any[];
  };
}

export interface Response {
  statusCode?: number;
  body?: string | any;
  headers?: {
    [key: string]: any;
  };
}

export interface ExpectationTimes {
  remainingTimes: number;
  unlimited: boolean;
}

export interface Expectation {
  name: string;
  description?: string;
  request: Request;
  response: Response;

  times?: ExpectationTimes;
  delay?: number;
  timeToLive?: number;
  priority?: number;
}
