import express from "express";
import {
  verifyJWT,
  requireAdmin,
} from "../middlewares/verifyUser.middleware.js";
import upload from "../middlewares/resumeUpload.middleware.js";
import {
  listSubmissions,
  getSubmission,
  approveSubmission,
  rejectSubmission,
  uploadExperiencePdf,
  getAdminStats,
} from "../controllers/admin.controller.js";

const router = express.Router();

// All admin routes require a valid JWT AND admin role
router.use(verifyJWT, requireAdmin);

/* ── Overview ── */
router.get("/stats", getAdminStats);

/* ── Submission management ── */
router.get("/submissions", listSubmissions); // ?status=pending|approved|rejected|all
router.get("/submissions/:id", getSubmission);
router.patch("/submissions/:id/approve", approveSubmission);
router.patch("/submissions/:id/reject", rejectSubmission);

/* ── Admin PDF upload → direct to MockInterview ── */
router.post("/upload-pdf", upload.single("pdf"), uploadExperiencePdf);

export default router;
