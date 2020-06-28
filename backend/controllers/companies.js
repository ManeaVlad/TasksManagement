const Company = require("../models/companies");

exports.createCompany = (req, res, next) => {
  const companyUsed = new Company({
    companyName: req.body.company,
  });
  const companyValue = req.body.company;
  Company.findById(companyValue)
    .then((company) => {
      if (company) {
        res.status(200).json({
          message: "Joined company.",
          company: company.companyName,
        });
      }
    })
    .catch((error) => {
      companyUsed
        .save()
        .then((createdCompany) => {
          res.status(201).json({
            message: "Company created successfully.",
            company: createdCompany.companyName,
          });
        })
        .catch((error) => {
          res.status(500).json({
            message: "Creating a new company failed.",
          });
        });
    });
};

exports.getCompanies = (req, res, next) => {
  const companyQuery = Company.find();
  let fetchedCompanies;
  companyQuery
    .then((documents) => {
      fetchedCompanies = documents;
    })
    .then((count) => {
      res.status(200).json({
        message: "Companies fetched successfully.",
        company: fetchedCompanies,
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Fetching companies failed.",
      });
    });
};

exports.getCompanyId = (req, res, next) => {
  Company.find({ companyName: req.user.local.companyName })
    .then((documents) => {
      res.status(200).json({
        message: "Company fetched successfully.",
        company: documents[0]._id,
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Fetching company failed.",
      });
    });
};
