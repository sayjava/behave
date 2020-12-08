export interface Request {
  path: string;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "OPTION" | "PATCH";
  contentType?: "application/json" | "text/plain";
  body?:
    | string
    | {
        [key: string]: any;
      };

  headers?: {
    [key: string]: string;
  };
  pathParams?: {
    [key: string]: any;
  };
  queryParams?: {
    [key: string]: any;
  };
  time?: number;
}

export interface Verification {
  request: Request;
  limit?: {
    atLeast?: number;
    atMost?: number | "unlimited";
  };
}

export interface IntervalVerification {
  requests: Request[];
  interval: {
    atLeast?: number;
    atMost?: number;
  };
}

export interface VerificationError {
  message: string;
  actual: any;
  expected: any;
  records: Record[];
}

export interface Response {
  /**
   * HTTP Status code
   */
  statusCode?: number;

  /**
   * Response body
   */
  body?: string | any;

  /**
   * Use local file as the response body
   */
  file?: string;

  /**
   * Attachment to stream back to client
   */
  attachment?: string;

  /**
   * how long the response should be delayed in seconds
   */
  delay?: number;

  /**
   * HTTP response headers
   */
  headers?: {
    [key: string]: any;
  };
}

export interface Behavior {
  id?: string;
  name: string;
  description?: string;
  request: Request;
  response: Response;

  limit?: "unlimited" | number;
  timeToLive?: number;
  priority?: number;
  delay?: number;
}

export interface Record {
  request: Request;
  matches: Behavior[];
  timestamp: number;
}
