import { NextFunction, Request, Response } from "express"
import Joi from "joi"

export const taskValidate = (req: Request, res: Response, next: NextFunction) => {
  try {
    const schema = Joi.object({
      taskContent: Joi.string().max(255).required()
        .messages({
          "string.empty": "Tên nhiệm vụ không được để trống",
          "string.max": "Tên nhiệm vụ chỉ chứa nhiều nhất 255 ký tự",
          "any.required": "Tên nhiệm vụ bắt buộc phải có"
        }),
      status: Joi.string().required()
        .messages({
          "string.empty": "Trạng thái nhiệm vụ bắt buộc phải có",
          "any.required": "Trạng thái nhiệm vụ bắt buộc phải có"
        })
    });

    const { error } = schema.validate(req.body);

    if(error) {
      return res.status(400).json({
        message: error.details[0].message,
      })
    };

    next();
  } catch (error) {
    console.log(error)
    res.status(400).json({
      code: "error",
      message: error
    })
  }
}