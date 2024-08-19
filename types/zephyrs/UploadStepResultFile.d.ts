export interface UploadStepResultFileResponse {
  id: string;
  ztId: string;
  name: string;
  fileExtension: string;
  createDate: string;
  createdBy: string;
  createdByAccountId: string;
  size: number;
  comment: string;
  entityId: string;
  entityType: string;
  cycleId: string;
  versionId: number;
  ztIdIndex: string;
  createDateLong: number;
}

export interface UploadStepResultFileRequest {
  entityId: string;
  executionId: string;
  projectId: number;
  issueId: number;
  cycleId: string;
  versionId: number;
}
