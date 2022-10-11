import express from "express";

import { validateUrl } from "../middlewares/urls-schema.js";
import { postUrl } from "../controllers/urls.js";
import { validateTokenFromUser } from "../middlewares/validate-token.js";

const router = express.Router();
router.post("/urls/shorten", validateTokenFromUser, validateUrl, postUrl);

export default router;
