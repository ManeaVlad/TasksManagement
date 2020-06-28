const express = require("express");
const router = express.Router();
const passport = require("passport");
const companyController = require("../controllers/companies");

router.post(
  "/company",
  passport.authenticate("jwt", { session: false }),
  companyController.createCompany
);

router.get(
  "",
  passport.authenticate("jwt", { session: false }),
  companyController.getCompanies
);

router.get(
  "/id",
  passport.authenticate("jwt", { session: false }),
  companyController.getCompanyId
);

module.exports = router;
