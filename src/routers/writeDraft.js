import { Router } from "express";
import { writeDraft } from "../controllers/writeDraft.js";

const writeDraftRouter = Router();

writeDraftRouter.get("/", writeDraft);

export default writeDraftRouter;
