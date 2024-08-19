export interface TestStep {
  id: string;
  orderId: number;
  issueId: number;
  step: string;
  data: string;
  result: string;
  createdBy: string;
  createdByAccountId: string;
  modifiedBy: string;
  modifiedByAccountId: string;
  createdOn: number;
  lastModifiedOn: number;
  customFieldValues: any[];
  attachments: any[];
}

export interface TestStepRequest {
  issueId: string;
  projectId: string;
}
