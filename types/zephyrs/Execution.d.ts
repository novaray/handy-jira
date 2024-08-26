export interface ExecutionResponse {
  execution: {
    warningMessage: null | string;
    originMessage: null | string;
    execution: Execution;
    issueKey: string;
    issueSummary: string;
    issueDescription: string;
    projectName: string;
    // 그 외 불필요한 데이터 생략. 추후 필요시 추가.
  };
}

export interface Execution {
  id: string;
  issueId: number;
  versionId: number;
  projectId: number;
  cycleId: string;
  orderId: number;
  createdBy: string;
  createdByAccountId: string;
  status: {
    id: number;
    name: string;
    description: string;
    color: string;
    type: number;
  };
  cycleName: string;
  defects: any[];
  // 그 외 불필요한 데이터 생략. 추후 필요시 추가.
}

export interface ExecutionRequest {
  issueId: number;
  projectId: number;
  executionId: string;
}
