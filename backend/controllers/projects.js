const Project = require("../models/projects");

exports.createProject = (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  const user = req.user.google.id === "" ? req.user.local : req.user.google;
  const project = new Project({
    title: req.body.title,
    description: req.body.description,
    imagePath: url + "/images/" + req.file.filename,
    creator: user.userName,
    priority: req.body.priority,
    assignee: req.body.assignee,
    dueDate: req.body.dueDate,
    startDate: req.body.startDate,
    company: req.user.local.companyName,
  });

  project
    .save()
    .then((createdProject) => {
      res.status(201).json({
        message: "Project created successfully.",
        project: {
          ...createdProject,
          id: createdProject._id,
        },
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Creating a new project failed.",
      });
    });
};

exports.updateProject = (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  }
  const user = req.user.google.id === "" ? req.user.local : req.user.google;
  const project = new Project({
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
  });
  Project.updateOne({ _id: req.params.id, creator: user.userName }, project)
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

exports.getProjects = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const projectQuery = Project.find({ company: req.user.local.companyName });
  let fetchedProjects;
  if (pageSize && currentPage) {
    projectQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  projectQuery
    .then((documents) => {
      fetchedProjects = documents;
      return Project.count();
    })
    .then((count) => {
      res.status(200).json({
        message: "Projects fetched successfully.",
        project: fetchedProjects,
        maxProjects: count,
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Fetching projects failed.",
      });
    });
};

exports.getProjectById = (req, res, next) => {
  Project.findById(req.params.id)
    .then((project) => {
      if (project) {
        res.status(200).json(project);
      } else {
        res.status(404).json({ message: "Project not found." });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Fetching projects failed.",
      });
    });
};

exports.deleteProjectById = (req, res, next) => {
  const user = req.user.google.id === "" ? req.user.local : req.user.google;
  Project.deleteOne({ _id: req.params.id, creator: user.userName })
    .then((result) => {
      if (result.n > 0) {
        res.status(200).json({ message: "Project deleted." });
      } else {
        res.status(401).json({ message: "Not authorized user." });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Fetching projects failed.",
      });
    });
};
