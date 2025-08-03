import validator from "validator";

export default function validatePatientData(data) {
  const { patientName, email, phoneNo, date, time } = data;

  if (!patientName || !validator.isLength(patientName, { min: 2 })) {
    throw new Error("Invalid patient name");
  }

  if (!email || !validator.isEmail(email)) {
    throw new Error("Invalid email address");
  }

  if (!phoneNo || !validator.isMobilePhone(phoneNo, "any")) {
    console.log("Invalid phone number:", phoneNo);
    throw new Error("Invalid phone number");
  }

  if (!date || !validator.isISO8601(date)) {
    throw new Error("Invalid appointment date");
  }

  if (!time || !validator.matches(time, /^([01]\d|2[0-3]):([0-5]\d)$/)) {
    throw new Error("Invalid time format (HH:mm)");
  }
}
