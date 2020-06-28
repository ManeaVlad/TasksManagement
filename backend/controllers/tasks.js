const Task = require("../models/tasks");
const Notification = require("../models/notifications");

exports.createTask = (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  const user = req.user.google.id === "" ? req.user.local : req.user.google;
  const task = new Task({
    title: req.body.title,
    description: req.body.description,
    imagePath: url + "/images/" + req.file.filename,
    creator: user.userName,
    state: req.body.state,
    priority: req.body.priority,
    assignee: req.body.assignee,
    dueDate: req.body.dueDate,
    startDate: req.body.startDate,
    company: req.user.local.companyName,
    issueType: req.body.issueType,
    project: req.body.project,
  });
  task
    .save()
    .then((createdTask) => {
      res.status(201).json({
        message: "Task created successfully.",
        task: {
          ...createdTask,
          id: createdTask._id,
        },
      });
      const notification = new Notification({
        title: req.body.title,
        assignee: req.body.assignee,
        taskId: createdTask._id,
        dueDate: req.body.dueDate,
        startDate: req.body.startDate,
        company: req.user.local.companyName,
        view: false,
      });
      notification
        .save()
        .then((createdNotification) => {})
        .catch((error) => {
          res.status(500).json({
            message: "Creating a new notification failed.",
          });
        });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Creating a new task failed.",
      });
    });
};

exports.updateTask = (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  }
  const user = req.user.google.id === "" ? req.user.local : req.user.google;
  const task = new Task({
    _id: req.body.id,
    title: req.body.title,
    description: req.body.description,
    imagePath: imagePath,
    creator: user.userName,
    state: req.body.state,
    priority: req.body.priority,
    assignee: req.body.assignee,
    dueDate: req.body.dueDate,
    startDate: req.body.startDate,
    company: req.user.local.companyName,
    issueType: req.body.issueType,
    project: req.body.project,
  });
  Task.updateOne({ _id: req.params.id, creator: user.userName }, task)
    .then((result) => {
      if (result.n > 0) {
        res.status(200).json({ message: "Updated succesfully!" });
      } else {
        res.status(401).json({ message: "Not authorized user." });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Edit failed!",
      });
    });
};

exports.getTasks = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const taskQuery = Task.find({ company: req.user.local.companyName });
  let fetchedTasks;
  if (pageSize && currentPage) {
    taskQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  taskQuery
    .then((documents) => {
      fetchedTasks = documents;
      return Task.count();
    })
    .then((count) => {
      res.status(200).json({
        message: "Tasks fetched successfully.",
        task: fetchedTasks,
        maxTasks: count,
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Fetching tasks failed.",
      });
    });
};

exports.getTaskById = (req, res, next) => {
  Task.findById(req.params.id)
    .then((task) => {
      if (task) {
        res.status(200).json(task);
      } else {
        res.status(404).json({ message: "Task not found." });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Fetching task failed.",
      });
    });
};

exports.getTasksByProject = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const taskQuery = Task.find({ project: req.params.project });
  let fetchedTasks;
  if (pageSize && currentPage) {
    taskQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  taskQuery
    .then((documents) => {
      fetchedTasks = documents;
      return Task.count();
    })
    .then((count) => {
      res.status(200).json({
        message: "Tasks fetched successfully.",
        task: fetchedTasks,
        maxTasks: count,
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Fetching tasks failed.",
      });
    });
};

exports.deleteTaskById = (req, res, next) => {
  const user = req.user.google.id === "" ? req.user.local : req.user.google;
  Task.deleteOne({ _id: req.params.id, creator: user.userName })
    .then((result) => {
      if (result.n > 0) {
        res.status(200).json({ message: "Task deleted." });
      } else {
        res.status(401).json({ message: "Not authorized user." });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Fetching task failed.",
      });
    });
};

exports.updateTaskByStatePending = (req, res, next) => {
  Task.findOneAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        state: "Pending",
      },
    }
  )
    .then((result) => {
      res.status(200).json({ message: "Updated succesfully!" });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Edit failed!",
      });
    });
};

exports.updateTaskByStateInProgress = (req, res, next) => {
  Task.findOneAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        state: "In Progress",
      },
    }
  )
    .then((result) => {
      res.status(200).json({ message: "Updated succesfully!" });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Edit failed!",
      });
    });
};

exports.updateTaskByStateFinished = (req, res, next) => {
  Task.findOneAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        state: "Finished",
      },
    }
  )
    .then((result) => {
      res.status(200).json({ message: "Updated succesfully!" });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Edit failed!",
      });
    });
};
