import express from "express";

import { validateUrl } from "../middlewares/urls-schema.js";
import {
  postUrl,
  getUrlById,
  redirectToUrl,
  deleteUrl,
  getUrlsFromASingleUser,
  getRanking,
} from "../controllers/urls.js";
import { validateTokenFromUser } from "../middlewares/validate-token.js";

const router = express.Router();
router.post("/urls/shorten", validateTokenFromUser, validateUrl, postUrl);
router.get("/urls/:id", getUrlById);
router.get("/urls/open/:shortUrl", redirectToUrl);
router.delete("/urls/:id", validateTokenFromUser, deleteUrl);
router.get("/users/me", validateTokenFromUser, getUrlsFromASingleUser);
router.get("/ranking", getRanking);

export default router;
