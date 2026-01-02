import { Router } from "express";
import { createTask, createTaskAdvan, deleteTask, getAllTask, taskList, updateStatusTask, updateTask, updateTaskAdvan } from "../controllers/task.controller";
import { taskValidate } from "../validates/task.validate";

const router = Router();

router.post("/create", taskValidate, createTask);

router.get("/list", taskList);

router.put("/update/:id", taskValidate, updateTask);

router.delete("/delete/:id", deleteTask);

router.put("/update/status/:id", updateStatusTask);

router.get("/all/list", getAllTask);

router.put("/update/advan/:id", updateTaskAdvan);

router.post("/create/advan", createTaskAdvan);
export default router;