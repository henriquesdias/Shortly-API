import express from "express";

import { validateUrl } from "../middlewares/urls-schema.js";
import { postUrl, getUrlById, redirectToUrl } from "../controllers/urls.js";
import { validateTokenFromUser } from "../middlewares/validate-token.js";

const router = express.Router();
router.post("/urls/shorten", validateTokenFromUser, validateUrl, postUrl);
router.get("/urls/:id", getUrlById);
router.get("/urls/open/:shortUrl", redirectToUrl);

export default router;
