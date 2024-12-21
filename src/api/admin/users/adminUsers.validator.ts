import { body } from "express-validator";

export class AdminUsersValidator {
  validateUser = [
    body("username")
      .notEmpty()
      .withMessage("Username is required")
      .isAlphanumeric()
      .withMessage("Username must be alphanumeric"),
    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long")
      .matches(/[A-Z]/)
      .withMessage("Password must contain at least one uppercase letter")
      .matches(/[a-z]/)
      .withMessage("Password must contain at least one lowercase letter")
      .matches(/[0-9]/)
      .withMessage("Password must contain at least one number")
      .matches(/[@$!%*?&]/)
      .withMessage("Password must contain at least one special character"),
    body("full_name")
      .notEmpty()
      .withMessage("Full name is required")
      .isString()
      .withMessage("Full name must be a string"),
    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email must be a valid email address"),
    body("phone_number")
      .notEmpty()
      .withMessage("Phone number is required")
      .matches(/^01[0-9]{9}$/)
      .withMessage("Phone number must be a valid Bangladeshi mobile number"),
  ];

  loginAdmin = [
    body("username").notEmpty().withMessage("Username is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ];
}
