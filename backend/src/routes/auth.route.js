import express from "express";
import { checkAuth, profilePicUpdate, signin, signout, signup } from "../controllers/auth.controllers.js";
import { middlewareRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup)

router.post("/signin", signin)

router.post("/signout", signout)

router.put("/update-profile", middlewareRoute, profilePicUpdate)

router.get("/check", middlewareRoute, checkAuth)

export default router