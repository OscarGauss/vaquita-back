import express from 'express';
import { safeResponse } from 'helpers';
import {
  __setTimestampGroup,
  archiveGroup,
  getAllGroups,
  getGroupData,
  postCreateGroup,
  postDepositGroup,
  postDisjoinGroup,
  postJoinGroup,
  postWithdrawal,
} from './controller';

const router = express.Router();

router.get('/', safeResponse(getAllGroups));
router.post('/create', safeResponse(postCreateGroup));

router.get('/:id', safeResponse(getGroupData));
router.delete('/:id', safeResponse(archiveGroup));
router.post('/:id/deposit', safeResponse(postDepositGroup));
router.post('/:id/disjoin', safeResponse(postDisjoinGroup));
router.post('/:id/join', safeResponse(postJoinGroup));
router.post('/:id/withdrawal', safeResponse(postWithdrawal));

router.post('/:id/set-timestamp', safeResponse(__setTimestampGroup));

export default router;
