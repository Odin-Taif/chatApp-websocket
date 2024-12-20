import { signInSchema, signUpSchema } from "@/zod/zod-validation";
import { Repository } from "./repository";
import { SIGNUP_ERRORS, SIGNUP_PAYLOAD, SIGNIN_PAYLOAD } from "./types";
import { createSession } from "../../lib/session";

export function createService(repository: Repository) {
  async function signup({ email, password, name }: SIGNUP_PAYLOAD) {
    const userValidated = signUpSchema.safeParse({ email, password, name });
    if (!userValidated.success) {
      const errors = userValidated.error.flatten().fieldErrors;
      const errorMessages: SIGNUP_ERRORS = {};
      if (errors.email && errors.email.length > 0) {
        errorMessages.email =
          "Email is required and should be a valid email address.";
      }
      if (errors.password && errors.password.length > 0) {
        errorMessages.password =
          "Password is required and must be at least 6 characters long.";
      }
      if (errors.name && errors.name.length > 0) {
        errorMessages.name =
          "Name is required and should be at least 3 characters long.";
      }
      return {
        success: false,
        message: "Validation failed. Please check your input.",
        errors: errorMessages,
      };
    }
    try {
      const userId = await repository.signupUserInDb(userValidated.data);
      return {
        success: true,
        userId: userId,
        message: "Sign up successful!",
        errors: {},
      };
    } catch (dbError) {
      console.error("Database Error:", dbError);
      return {
        success: false,
        message: "An error occurred while saving the user to the database.",
        errors: dbError,
      };
    }
  }

  async function signin({ email, password }: SIGNIN_PAYLOAD) {
    const signInValidated = signInSchema.safeParse({ email, password });
    if (!signInValidated.success) {
      const errors = signInValidated.error.flatten().fieldErrors;
      const errorMessages: SIGNUP_ERRORS = {};
      if (errors.email && errors.email.length > 0) {
        errorMessages.email =
          "Email is required and should be a valid email address.";
      }
      if (errors.password && errors.password.length > 0) {
        errorMessages.password =
          "Password is required and must be at least 6 characters long.";
      }
      return {
        success: false,
        message: "Validation failed. Please check your input.",
        errors: errorMessages,
      };
    }
    try {
      const signedInUser = await repository.signinUserInDb(
        signInValidated.data
      );

      if (signedInUser?.error) {
        return {
          success: false,
          message: signedInUser.error,
          errors: signedInUser.error,
        };
      }
      if (signedInUser) {
        await createSession(signedInUser);
      } else {
        throw new Error("User ID is undefined");
      }
      return {
        user: signedInUser,
        success: true,
        message: "Sign in successfully!",
      };
    } catch (dbError) {
      console.error("Database Error:", dbError);
      return {
        success: false,
        message: "An error occurred while signing in the user!",
        errors: dbError,
      };
    }
  }

  async function getAllUsers() {
    const users = await repository.getAllUsersFromDb();
    return users;
  }
  async function getLoggedInUser(sessionUserId: string) {
    const user = await repository.getLoggedInUserFromDb(sessionUserId);
    return user;
  }

  async function setProfileImageUrl(userId: number, imageUrl: string) {
    await repository.setProfileImageUrlInDb(userId, imageUrl);
  }
  return {
    signup,
    signin,
    getAllUsers,
    setProfileImageUrl,
    getLoggedInUser,
  };
}
