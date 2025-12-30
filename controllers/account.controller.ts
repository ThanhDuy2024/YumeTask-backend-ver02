import { Request, Response } from "express";
import { Account } from "../models/Account.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { users } from "../interfaces/account.interface";
import moment from "moment";
import { htmlCheckEmail } from "../helpers/htmlContext.hepler";
import { randomString } from "../helpers/randomString.hepler";
import { sendEmail } from "../helpers/nodemailer.hepler";
import { client } from "../config/redis.config";
export const createAccount = async (req: Request, res: Response) => {
  try {
    const check = await Account.findOne({
      email: req.body.email
    });

    if(check) {
      return res.status(400).json({
        code: "success",
        message: "Email này đã được đăng ký"
      });
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    req.body.password = hash;

    const checkOtp = await client.get(`email:${req.body.email}`);

    if(checkOtp) {
      return res.status(400).json({
        code: "success",
        message: "Gui lai OTP sau 5 phut"
      })
    }

    const otp = randomString(6);
    const html:string = htmlCheckEmail(otp);
    const subject:string = `OTP XÁC THỰC EMAIL CỦA BẠN`

    //Set data
    const data = {
      userName: req.body.userName,
      email: req.body.email,
      password: req.body.password,
    };

    await client.set(`otp:${otp}`, JSON.stringify(data));

    await client.set(`email:${req.body.email}`, JSON.stringify("confirm"), {
      EX: 5 * 60
    });

    sendEmail(req.body.email, html, subject)
    res.json({
      code: "success",
      message: "OTP đã được gửi đi",
    });
  } catch (error) {
    console.log(error)
    res.status(400).json({
      message: error
    })
  }
}

export const confirmEmail = async (req: Request, res: Response) => {
  try {

    const { otp } = req.body
    const otpLower = otp.toLowerCase();
    const getData = await client.get(`otp:${otpLower}`);

    if(!getData) {
      return res.status(400).json({
        code: "error",
        message: "OTP của bạn bị sai!"
      })
    }

    const dataDecode = JSON.parse(getData);

    await Account.create(dataDecode);
    
    res.json({
      code: "success",
      message: "Đăng ký tài khoản thành công"
    })

  } catch (error) {
    res.status(400).json({
      code: "error",
      message: "Xác thực email thất bại"
    })
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const checkEmail = await Account.findOne({
      email: email
    });

    if(!checkEmail) {
      return res.status(404).json({
        code: "error",
        message: "Email hoặc mật khẩu không đúng"
      })
    }

    const verifyPassword = bcrypt.compareSync(password, String(checkEmail.password))

    if(!verifyPassword) {
      return res.status(404).json({
        code: "error",
        message: "Email hoặc mật khẩu không đúng"
      })
    }

    const token = jwt.sign({
      username: checkEmail.userName,
      email: checkEmail.email
    }, String(process.env.JWT));

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      secure: String(process.env.ENVIROIMENT) == "dev" ? false : true,
      sameSite: "lax",
      //partitioned: true
    });

    res.status(200).json({
      code: "success",
      message: "Đăng nhập thành công"
    })
  } catch (error) {
    console.log(error)
    res.status(400).json({
      code: "error",
      message: error
    })
  }
}

export const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie("token");
    
    res.status(200).json({
      code: "success",
      message: "Đăng xuất thành công"
    })
  } catch (error) {
    console.log(error);
    res.status(400).json({
      code: "errror",
      message: "Đăng xuất thất bại"
    })
  }
}

export const profileUser = async (req: users, res: Response) => {
  try {
    const { id, userName, email, createdAt, updatedAt, } = req.users
    const createdAtFormat = moment(createdAt).format("DD/MM/YYYY HH:mm");
    const updatedAtFormat = moment(updatedAt).format("DD/MM/YYYY HH:mm");

    const userData:any = {
      id: id,
      userName: userName,
      email: email,
      image: "",
      createdAt: createdAtFormat,
      updatedAt: updatedAtFormat
    }

    res.status(200).json({
      data: userData
    })
  } catch (error) {
    console.log(error);
    res.status(400).json({
      code: "error",
      message: ""
    })
  }
}