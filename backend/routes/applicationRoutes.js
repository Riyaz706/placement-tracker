import express from "express";
import { getMyApplications,applyToCompany,getCompanyApplicants,updateApplicationStatus} from "../controllers/applicationController.js";
import { protect,adminOnly} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/apply/:id",protect,applyToCompany);

router.get("/my-applications",protect,getMyApplications);

router.get("/company/:id",protect,adminOnly,getCompanyApplicants);

router.put("/:id/status",protect,adminOnly,updateApplicationStatus);

export default router;