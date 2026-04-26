import { Router } from 'express';
import { 
  screenCandidate, 
  chatbotInterview, 
  generateInterviewQuestionsGroq, 
  generateCandidateSummary,
  parseCV,
  chatbotMessage,
  getChatbotHistory,
  clearChatbot,
  generateInterviewQuestions,
  analyzeCV,
  deepCVAnalysis,
  teamAnalysis,
  advancedRiskAnalysis,
  marketAnalysis,
  predictiveAnalysis,
  cultureFitAnalysis,
  matchingAnalysisCandidate
} from './ai.controller';
import { authenticate, authorize } from '../../middleware/auth';

const router = Router();

router.post('/screen', authenticate, authorize(['RH', 'SUPER_ADMIN', 'ADMIN', 'MANAGER']), screenCandidate);
router.post('/chatbot', chatbotInterview); // public for candidate self-service
router.post('/interview-questions', authenticate, authorize(['RH', 'SUPER_ADMIN', 'ADMIN', 'MANAGER']), generateInterviewQuestionsGroq);
router.post('/candidate-summary', authenticate, authorize(['RH', 'SUPER_ADMIN', 'ADMIN']), generateCandidateSummary);

// New DeepSeek and Chatbot endpoints
router.post('/parse-cv', authenticate, parseCV);
router.post('/chatbot-message', authenticate, chatbotMessage);
router.get('/chatbot/history', authenticate, getChatbotHistory);
router.delete('/chatbot/clear', authenticate, clearChatbot);
router.post('/generate-questions', authenticate, generateInterviewQuestions);
router.post('/cv-analysis', authenticate, analyzeCV);

// New Groq Deep Analysis endpoints
router.post('/deep-cv-analysis', authenticate, authorize(['RH', 'SUPER_ADMIN', 'MANAGER', 'ADMIN']), deepCVAnalysis);
router.post('/team-analysis', authenticate, authorize(['RH', 'SUPER_ADMIN', 'MANAGER', 'ADMIN']), teamAnalysis);
router.post('/advanced-risk-analysis', authenticate, authorize(['RH', 'SUPER_ADMIN', 'ADMIN']), advancedRiskAnalysis);
router.post('/market-analysis', authenticate, authorize(['RH', 'SUPER_ADMIN', 'MANAGER', 'ADMIN']), marketAnalysis);
router.post('/predictive-analysis', authenticate, authorize(['RH', 'SUPER_ADMIN', 'MANAGER', 'ADMIN']), predictiveAnalysis);
router.post('/culture-fit-analysis', authenticate, authorize(['RH', 'SUPER_ADMIN', 'MANAGER', 'ADMIN']), cultureFitAnalysis);
router.post('/matching-analysis', authenticate, matchingAnalysisCandidate);

export default router;
