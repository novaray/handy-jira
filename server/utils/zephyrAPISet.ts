import type { UploadStepResultFileRequest } from '~~/types/zephyrs/UploadStepResultFile';
import type { TestStepRequest } from '~~/types/zephyrs/TestStep';
import type { StepResultRequest } from '~~/types/zephyrs/StepResult';
import type { ExecutionRequest } from '~~/types/zephyrs/Execution';

/**
 * 각 함수는 HTTP method, relative path, query string을 만들어서 리턴한다.
 */
export class ZephyrAPISet {
  static getExecution(request: ExecutionRequest) {
    return {
      method: 'GET',
      relativePath: `/public/rest/api/1.0/execution/${request.executionId}`,
      querystring: `issueId=${request.issueId}&projectId=${request.projectId}`
    };
  }

  static getAllTestSteps(request: TestStepRequest) {
    return {
      method: 'GET',
      relativePath: `/public/rest/api/1.0/teststep/${request.issueId}`,
      querystring: `projectId=${request.projectId}`
    };
  }

  static getStepResultsByExecution(request: StepResultRequest) {
    return {
      method: 'GET',
      relativePath: `/public/rest/api/1.0/stepresult/search`,
      querystring: `executionId=${request.executionId}&issueId=${request.issueId}`
    };
  }

  static getUploadStepResultFile(request: UploadStepResultFileRequest) {
    return {
      method: 'POST',
      relativePath: `/public/rest/api/1.0/attachment`,
      querystring: `comment=&cycleId=${request.cycleId}&entityId=${request.entityId}&entityName=stepResult&executionId=${request.executionId}&issueId=${request.issueId}&projectId=${request.projectId}&versionId=${request.versionId}`
    };
  }
}
