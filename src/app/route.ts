import express from 'express';
import { routerGetEnvs, routerGetNodeEnv, routerGetPing, routerGetStatus, routerGetVersion } from './controller';

const router = express.Router();

router.get('/ping', routerGetPing);
router.get('/version', routerGetVersion);
router.get('/node-env', routerGetNodeEnv);
router.get('/status', routerGetStatus);
router.get('/envs', routerGetEnvs);

export default router;
