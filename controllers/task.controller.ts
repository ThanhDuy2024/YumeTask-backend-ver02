import { Response } from "express";
import { users } from "../interfaces/account.interface";
import { Task } from "../models/Task.model";
import moment from "moment";
import { statusArray } from "../config/variable.config";
import { paginationHelper } from "../helpers/pagination.helper";
import slugify from "slugify";
import dayjs from "dayjs";
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

    const {search, status, time, page, limit } = req.query;
    const findTask:any = {
      userId: req.users.id,
    };

    //tim kiem nhiem vu
    if(search && String(search).trim() !== "" && String(search).trim() !== '""') {
      const keyword = slugify(String(search), {
        lower: true
      });

      const regex = new RegExp(keyword);

      findTask.slug = regex;
    }

    //Loc nhiem vu theo trang thai
    if(statusArray.includes(String(status)) && status && String(status).trim() !== "" && String(status).trim() !== '""') {
      findTask.status = status;
    };

    //Loc theo ngay, thang, nam
    if(time && time !== "all") {
      let startDate
      let endDate = dayjs().endOf('day').toDate(); //cuoi ngay hom nay

      if(time === "today") {
        startDate = dayjs().startOf('day').toDate(); //bat dau ngay
      } else if(time === "week") {
        startDate = dayjs().startOf('week').toDate(); //Ngay bat dau cua tuan
      } else if (time === "month") {
        startDate = dayjs().startOf('month').toDate(); //Ngay bat dau cua thang
      }

      findTask.createdAt = {
        $gte: startDate,
        $lte: endDate
      }
    }

    const totalTask:number = await Task.countDocuments(findTask);
    const pagination = paginationHelper(Number(page), Number(skip), Number(limit), totalTask);

    const list = await Task.find(findTask).sort({
      createdAt: "desc"
    }).limit(Number(limit)).skip(pagination.skip);

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

export const getAllTask = async (req: users, res: Response) => {
  try {
    const find:any = {
      userId: req.users.id
    }

    const data:Array<object> = [];
    const tasks = await Task.find(find);

    for (const item of tasks) {
      const rawData:any = {
        id: item._id,
        userId: item.userId,
        taskContent: item.taskContent,
        status: item.status,
        taskNote: item.taskNote,
        startTime: item.startTime,
        endTime: item.endTime,
        dateTime: item.dateTime,
        createdAt: "",
        updatedAt: "" 
      }

      rawData.createdAt = moment(item.createdAt).format("HH:mm DD/MM/YYYY");
      rawData.updatedAt = moment(item.updatedAt).format("HH:mm DD/MM/YYYY");

      data.push(rawData);
    }
    
    res.json({
      code: "success",
      data: data
    })
  } catch (error) {
    res.status(400).json({
      code: "error",
      message: "Lay task ko thanh cong"
    })
  }
}

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

export const updateTaskAdvan = async (req: users, res: Response) => {
  try {
    const task = await Task.findOne({
      userId: req.users.id,
      _id: req.params.id
    });

    if(!task) {
      return res.status(404).json({
        code: "success",
        message: "Task not found"
      })
    };

    await task.updateOne(req.body);
    task.save();

    res.json({
      code: "success",
      message: "update task ok!"
    })
  } catch (error) {
    console.log(error);
    res.status(400).json({
      code: "error",
      message: "update task error"
    })
  }
}