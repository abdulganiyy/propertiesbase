import * as yup from "yup";
import { REQUIRED, INVALID_EMAIL } from "./common-validation";

export const loginFormSchema = yup.object().shape({
  email: yup.string().email().required(INVALID_EMAIL),
  password: yup.string().required(REQUIRED),
});

export const forgotPasswordFormSchema = yup.object().shape({
  email: yup.string().email().required(INVALID_EMAIL),
});

export const resetPasswordFormSchema = yup.object().shape({
  password: yup.string().required("Password is required"),
  confirmPassword: yup
    .string()
    .required("Confirm password is required")
    .oneOf([yup.ref("password")], "Passwords must match"),
});

export const signUpFormSchema = yup.object().shape({
  email: yup.string().email().required(INVALID_EMAIL),
  phone: yup.string().required(),
  firstname: yup.string().required(),
  lastname: yup.string().required(),
  password: yup.string().required("Password is required"),
  confirmPassword: yup
    .string()
    .required("Confirm password is required")
    .oneOf([yup.ref("password")], "Passwords must match"),
});

export const profileSchema = yup.object().shape({
  email: yup.string().email().required(INVALID_EMAIL),
  phone: yup.string().required(),
  firstname: yup.string().required(),
  lastname: yup.string().required(),
  // password: yup.string().required("Password is required"),
  // confirmPassword: yup
  //   .string()
  //   .required("Confirm password is required")
  //   .oneOf([yup.ref("password")], "Passwords must match"),
});

export type ProfileFormData = yup.InferType<typeof profileSchema>;
