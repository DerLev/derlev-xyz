import type {Request} from "@google-cloud/functions-framework";
import type {Response} from "express";
import httpError from "./httpError";
import auth from "./firebaseAuth";
import type {DecodedIdToken} from "firebase-admin/auth";

interface ExtendedIdToken extends DecodedIdToken {
  /* Custom claims here */
}

/**
 * Check if a supplied token in auth header is valid
 * @param {Request} req Request object of function invocation
 * @param {Response} res Response object
 * @return {Promise<ExtendedIdToken>} User token object with info about the user
 */
const httpAuth = async (req: Request, res: Response) => {
  /* Get auth header and fail if not present or invalid format */
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    throw httpError(res, "unauthenticated");
  }

  if (!authHeader.startsWith("Bearer ")) {
    throw httpError(
      res,
      "invalid-argument",
      "Authorization header must be of type Bearer",
    );
  }

  /* Get the idToken from auth header */
  const idToken = authHeader.split("Bearer ")[1];

  /* Validate and decode token - fail if invalid */
  try {
    const decodedToken = (await auth.verifyIdToken(
      idToken,
      true,
    )) as ExtendedIdToken;
    return decodedToken;
  } catch (err) {
    throw httpError(res, "unauthenticated");
  }
};

export default httpAuth;
