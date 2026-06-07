import { Router, type IRouter } from "express";
import healthRouter from "./health";
import courseRouter from "./course";
import assignmentsRouter from "./assignments";
import practiceRouter from "./practice";
import tutorRouter from "./tutor";
import detectionRouter from "./detection";
import analyticsRouter from "./analytics";
import diagnosticsRouter from "./diagnostics";
import { requireAuth } from "../middlewares/requireAuth";

const router: IRouter = Router();

// Health check stays public for deploy probes.
router.use(healthRouter);

// Everything below requires a signed-in user (Clerk session cookie).
router.use(requireAuth);

router.use(courseRouter);
router.use(assignmentsRouter);
router.use(practiceRouter);
router.use(tutorRouter);
router.use(detectionRouter);
router.use(analyticsRouter);
router.use(diagnosticsRouter);

export default router;
