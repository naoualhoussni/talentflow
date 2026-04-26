import { EventEmitter } from 'events';

export enum TalentEvent {
  CANDIDATE_CREATED = 'candidate_created',
  CHATBOT_COMPLETED = 'chatbot_completed',
  INTERVIEW_COMPLETED = 'interview_completed',
  EVALUATION_SUBMITTED = 'evaluation_submitted',
  APPROVAL_REQUESTED = 'approval_requested',
  DOCUMENT_GENERATED = 'document_generated',
  DOCUMENT_REQUESTED = 'document_requested',
  EMPLOYEE_CREATED = 'employee_created',
  RISK_DETECTED = 'risk_detected',
}

class EventBus extends EventEmitter {
  private static instance: EventBus;

  private constructor() {
    super();
    this.setMaxListeners(20);
  }

  public static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  public emitEvent(event: TalentEvent, payload: any) {
    console.log(`[EventBus] Emitting event: ${event}`, payload);
    this.emit(event, payload);
  }

  public subscribe(event: TalentEvent, handler: (payload: any) => void) {
    this.on(event, handler);
  }
}

export const eventBus = EventBus.getInstance();
