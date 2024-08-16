export interface JiraErrorResponse {
  name: string;
  data: {
    data: string;
    message: string;
    stack: string;
    statusCode: number;
    statusMessage: string;
  };
  message: string;
  options: {
    baseURL: string;
    method?: string;
    query: {
      [key: string]: string;
    };
  };
  request: string;
  stack: string;
  status: number;
  statusCode: number;
  statusMessage: string;
  statusText: string;
}
