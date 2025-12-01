import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import * as teamController from '../controllers/teamController';

const router = Router();

router.use(authenticate);

router.get('/', teamController.getAllTeams);
router.post('/', teamController.createTeam);
router.get('/:id', teamController.getTeamById);
router.put('/:id', teamController.updateTeam);
router.delete('/:id', teamController.deleteTeam);
router.post('/:id/members', teamController.addMember);
router.delete('/:id/members/:userId', teamController.removeMember);
router.post('/:id/mentors', teamController.addMentor);

export default router;
