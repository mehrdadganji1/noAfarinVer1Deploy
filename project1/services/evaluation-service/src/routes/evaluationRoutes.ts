import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import * as evaluationController from '../controllers/evaluationController';

const router = Router();

router.use(authenticate);

router.get('/', evaluationController.getAllEvaluations);
router.post('/', evaluationController.createEvaluation);
router.get('/leaderboard', evaluationController.getLeaderboard);
router.get('/team/:teamId', evaluationController.getEvaluationsByTeam);
router.get('/team/:teamId/average', evaluationController.getTeamAverageScore);
router.get('/:id', evaluationController.getEvaluationById);
router.put('/:id', evaluationController.updateEvaluation);
router.delete('/:id', evaluationController.deleteEvaluation);
router.post('/:id/submit', evaluationController.submitEvaluation);

export default router;
