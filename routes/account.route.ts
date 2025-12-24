import { Router } from "express";
import { confirmEmail, createAccount, login, logout, profileUser } from "../controllers/account.controller";
import { createAccountValidate, loginValidate } from "../validates/account.validate";
import { accountMiddleware } from "../middlewares/account.middleware";
const router = Router();

router.post("/create", createAccountValidate, createAccount);

router.post("/otp", confirmEmail);

router.post("/login", loginValidate, login);

router.get("/logout", logout);

router.get("/profile", accountMiddleware, profileUser);


export default router;