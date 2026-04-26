import { eventBus, TalentEvent } from '../core/EventBus';
import { AIService } from '../modules/ai/ai.service';
import { DocumentService } from '../modules/document/document.service';
import { WorkflowService, WorkflowState } from '../modules/workflow/workflow.service';

export const setupEventListeners = () => {
  // 1. Candidate Created -> Trigger AI Parsing
  eventBus.subscribe(TalentEvent.CANDIDATE_CREATED, async (payload) => {
    await AIService.parseResume(payload.candidateId, payload.companyId);
  });

  // 2. Chatbot/AI Completed -> Update Workflow
  eventBus.subscribe(TalentEvent.CHATBOT_COMPLETED, async (payload) => {
    const newState = payload.score > 80 ? WorkflowState.EVALUATED : WorkflowState.REJECTED;
    await WorkflowService.transition(payload.candidateId, newState, payload.companyId);
  });

  // 3. Evaluation Submitted -> Generate Report
  eventBus.subscribe(TalentEvent.EVALUATION_SUBMITTED, async (payload) => {
    await DocumentService.generateInterviewReport(payload.candidateId, payload.companyId);
  });

  // 4. Employee Created -> Monitor Turnover
  eventBus.subscribe(TalentEvent.EMPLOYEE_CREATED, async (payload) => {
    console.log(`[Events] Monitoring new employee: ${payload.candidateId}`);
  });
};
