export interface StepResults {
  stepResults: StepResult[];
  executionStatus: {
    [key: string]: ExecutionStatus;
  };
  totalCount: number;
}

export interface StepResult {
  id: string;
  executionId: string;
  stepId: string;
  status: ExecutionStatus;
  issueId: number;
  createdBy: string;
  createdByAccountId: string;
  executionIndex: string;
  issueIndex: number;
  executionStatusIndex: number;
}

export interface ExecutionStatus {
  name: string;
  id: number;
  description: string;
  color: string;
  type: number;
}

export interface StepResultRequest {
  executionId: string;
  issueId: string;
}
