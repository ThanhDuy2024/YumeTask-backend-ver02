import { Router } from "express";
import { createTask, deleteTask, taskList, updateStatusTask, updateTask } from "../controllers/task.controller";
import { taskValidate } from "../validates/task.validate";

const router = Router();

router.post("/create", taskValidate, createTask);

router.get("/list", taskList);

router.put("/update/:id", taskValidate, updateTask);

router.delete("/delete/:id", deleteTask);

router.put("/update/status/:id", updateStatusTask);

export default router;