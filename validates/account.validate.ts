import { NextFunction, Request, Response } from "express";
import Joi from "joi";

export const createAccountValidate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const schema = Joi.object({
      userName: Joi.string().min(6).max(255).required()
        .messages({
          "string.empty": "Tên tài khoản không được bỏ trống",
          "string.min": "Tên tài khoản phải có ít nhất 6 ký tự",
          "string.max": "Tên tài khoản chỉ chứa được nhiều nhất 255 ký tự",
          "any.required": "Tên tài khoản không được bỏ trống"
        }),
      email: Joi.string().email().required()
        .messages({
          "string.empty": "Email không được để trống",
          "string.email": "Email của bạn không đúng định dạng",
          "string.required": "Email của bạn không được để trống"
        }),
      password: Joi.string().required()
        .messages({
          "string.empty": "Mật khấu không được để trống",
          "string.required": "Mật khẩu không được để trống"
        })
    });

    const { error } = schema.validate(req.body);
    if(error) {
      return res.status(400).json({
        code: "error",
        message: error.details[0].message
      })
    };

    next()
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: "error code"
    })
  }
}

export const loginValidate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const schema = Joi.object({
      email: Joi.string().email().required()
        .messages({
          "string.empty": "Email không được để trống",
          "string.email": "Email của bạn không đúng định dạng",
          "string.required": "Email của bạn không được để trống"
        }),
      password: Joi.string().required()
        .messages({
          "string.empty": "Mật khấu không được để trống",
          "string.required": "Mật khẩu không được để trống"
        })
    });
    const { error } = schema.validate(req.body);
    if(error) {
      return res.status(400).json({
        code: "error",
        message: error.details[0].message
      })
    };

    next()
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: "error code"
    })
  }
}