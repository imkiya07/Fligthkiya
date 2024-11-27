import { body } from "express-validator";

export class PreBookingValidator {
  bookingReq = [
    body("AirTravelers")
      .isArray({ min: 1 })
      .withMessage("AirTravelers must be an array with at least one element."),
    body("AirTravelers.*.PassengerType")
      .isIn(["ADT", "CHD", "INF"])
      .withMessage("PassengerType must be one of ADT, CHD, INF."),
    body("AirTravelers.*.Gender")
      .isIn(["M", "F"])
      .withMessage("Gender must be M or F."),
    body("AirTravelers.*.PassengerName.PassengerTitle")
      .isIn(["MR", "MRS", "MS"])
      .withMessage("PassengerTitle must be MR, MRS, or MS."),
    body("AirTravelers.*.PassengerName.PassengerFirstName")
      .isString()
      .notEmpty()
      .withMessage("PassengerFirstName is required and must be a string."),
    body("AirTravelers.*.PassengerName.PassengerLastName")
      .isString()
      .notEmpty()
      .withMessage("PassengerLastName is required and must be a string."),
    body("AirTravelers.*.DateOfBirth")
      .isISO8601()
      .withMessage("DateOfBirth must be a valid ISO8601 date."),
    body("AirTravelers.*.Passport.PassportNumber")
      .isString()
      .notEmpty()
      .withMessage("PassportNumber is required and must be a string."),
    body("AirTravelers.*.Passport.ExpiryDate")
      .isISO8601()
      .withMessage("ExpiryDate must be a valid ISO8601 date."),
    body("AirTravelers.*.Passport.Country")
      .isString()
      .isLength({ min: 2, max: 2 })
      .withMessage(
        "Passport Country must be a valid 2-character ISO country code."
      ),
    body("AirTravelers.*.PassengerNationality")
      .isString()
      .isLength({ min: 2, max: 2 })
      .withMessage(
        "PassengerNationality must be a valid 2-character ISO country code."
      ),
    body("AirTravelers.*.NationalID")
      .isString()
      .isLength({ min: 2, max: 2 })
      .withMessage("NationalID must be a valid 2-character ISO country code."),
    body("CountryCode")
      .isString()
      .isLength({ min: 1, max: 4 })
      .withMessage("CountryCode must be a valid country code."),
    body("PhoneNumber")
      .isString()
      .isLength({ min: 6 })
      .withMessage("PhoneNumber must be at least 6 characters long."),
    body("Email").isEmail().withMessage("Email must be a valid email address."),
    body("PostCode").isString().withMessage("PostCode is required."),
  ];
}
