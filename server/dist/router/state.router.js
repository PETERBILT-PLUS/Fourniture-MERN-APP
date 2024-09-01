import express from "express";
import { getState } from "../controller/state.controller.js";
export const stateRouter = express.Router();
stateRouter.get("/get-state", getState);
