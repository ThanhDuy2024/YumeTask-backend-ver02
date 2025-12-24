import { Response } from "express";
import { users } from "../interfaces/account.interface";
import { Task } from "../models/Task.model";
import moment from "moment";
import { statusArray } from "../config/variable.config";
import { paginationHelper } from "../helpers/pagination.helper";
import slugify from "slugify";
export const createTask = async (req: users, res: Response ) => {
  try {
    const task: any = req.body;

    task.userId = req.users.id;

    if(!statusArray.includes(task.status)) {
      return res.status(400).json({
        message: "Trạng thái không hợp lệ!"
      })
    }
    
    await Task.create(task);

    res.status(200).json({
      code: "success",
      message: "Tạo mục nhiệm vụ thành công"
    })
  } catch (error) {
    console.log(error)
    res.status(400).json({
      code: "error",
      message: "Tạo nhiệm vụ thất bại"
    })
  }
};

const skip = 0;
export const taskList = async (req: users, res: Response) => {
  try {

    const {search, status, page, limit } = req.query;

    const findTask:any = {
      userId: req.users.id,
    };

    if(search && String(search).trim() !== "" && String(search).trim() !== '""') {
      const keyword = slugify(String(search), {
        lower: true
      });

      const regex = new RegExp(keyword);

      findTask.slug = regex;
    }

    if(statusArray.includes(String(status))) {
      findTask.status = status;
    };

    const totalTask:number = await Task.countDocuments(findTask);
    const pagination = paginationHelper(Number(page), Number(skip), Number(limit), totalTask);

    const list = await Task.find(findTask).sort({
      createdAt: "desc"
    });

    const finalData:Array<object> = [];
    for (const item of list) {
      const rawData:any = {
        id: item.id,
        userId: item.userId,
        taskContent: item.taskContent,
        status: item.status,
        createdAt: "",
        updatedAt: ""
      };

      rawData.createdAt = moment(item.createdAt).format("HH:mm DD/MM/YYYY");
      rawData.updatedAt = moment(item.updatedAt).format("HH:mm DD/MM/YYYY");

      finalData.push(rawData);
    };

    res.status(200).json({
      code: "success",
      data: finalData,
      totalPage: pagination.totalPage
    });

  } catch (error) {
    console.log(error);
    res.status(400).json({
      code: "error",
      message: error
    })
  }
};

export const updateTask = async (req: users, res: Response) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);

    if(task?.taskContent?.toLowerCase != String(req.body.taskContent).toLowerCase) {
      const slug = slugify(String(req.body.taskContent), {
        lower: true
      });
      req.body.slug = slug;
    }
    await Task.updateOne({
      _id: id,
      userId: req.users.id
    }, req.body);

    res.status(200).json({
      code: "success",
      message: "Chỉnh sửa thành công"
    })
  } catch (error) {
    console.log(error);
    res.status(400).json({
      code: "error",
      message: "Chỉnh sửa thất bại"
    })
  }
}

export const deleteTask = async (req: users, res: Response) => {
  try {
    const { id } = req.params;

    await Task.deleteOne({
      _id: id,
      userId: req.users.id
    });
    
    res.status(200).json({
      code: "success",
      message: "Xóa thành công"
    })
  } catch (error) {
    console.log(error);
    res.status(400).json({
      code: "error",
      message: "Xóa thất bại"
    })
  }
}

export const updateStatusTask = async (req: users, res: Response) => {
  try {
    const { id } = req.params;
    const task = await Task.findOne({
      _id: id,
      userId: req.users.id,
    });

    if(!task) {
      return res.json({
        code: "error",
        message: "Không tìm thấy nhiệm vụ"
      });
    };

    await Task.updateOne({
      _id: id,
      userId: req.users.id
    }, {
      status: req.body.status
    });

    res.json({
      code: "success",
      message: "Cập nhật trạng thái thành công"
    })
  } catch (error) {
    console.log(error);
  }
}