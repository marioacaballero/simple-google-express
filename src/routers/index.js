import { Router } from "express";
import writeDraftRouter from "./writeDraft.js";

const indexRouter = Router();

indexRouter.use("/writeDraft", writeDraftRouter);

export default indexRouter;
