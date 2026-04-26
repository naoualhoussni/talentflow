import prisma from '../../utils/prisma';
import { eventBus, TalentEvent } from '../../core/EventBus';

export enum WorkflowState {
  APPLIED = 'APPLIED',
  CHATBOT_DONE = 'CHATBOT_DONE',
  EVALUATED = 'EVALUATED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  EMPLOYEE = 'EMPLOYEE',
}

export class WorkflowService {
  static async transition(candidateId: string, newState: WorkflowState, companyId: string) {
    console.log(`[Workflow] Transitioning candidate ${candidateId} to ${newState}`);
    
    const candidate = await prisma.candidate.update({
      where: { id: candidateId },
      data: { status: newState },
    });

    await prisma.workflowState.upsert({
      where: { candidateId },
      update: { state: newState },
      create: { candidateId, state: newState, companyId },
    });

    // Emit events based on state
    if (newState === WorkflowState.APPROVED) {
      eventBus.emitEvent(TalentEvent.APPROVAL_REQUESTED, { candidateId, companyId });
    } else if (newState === WorkflowState.EMPLOYEE) {
      eventBus.emitEvent(TalentEvent.EMPLOYEE_CREATED, { candidateId, companyId });
    }

    return candidate;
  }
}
