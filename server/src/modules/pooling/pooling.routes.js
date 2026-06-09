import {Router} from "express";
import * as controller from "./pooling.controller.js";
import { isLoggedIn } from "../auth/auth.middleware.js";
import {optionalAuth} from "./pooling.middleware.js"; 



const router = Router();

router.get("/allpools",isLoggedIn,controller.allPools);
router.get("/analytics/:pollid",isLoggedIn,controller.getAnalytics);
router.get("/public/getresult/:pollid", controller.getPublicResult);
router.get("/public/:pollid", controller.getPublicPoll);
router.get("/:pollid",isLoggedIn, controller.getPoll);
router.put("/publish/:pollid",isLoggedIn,controller.publishPoll)
router.post("/createpool", isLoggedIn, controller.createPool);
router.delete("/:poolid",isLoggedIn,controller.deletePool);

router.post("/poll/:pollid/vote", optionalAuth, controller.createVote);

export default router;