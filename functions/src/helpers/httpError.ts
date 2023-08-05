import type {Response} from "express";

type ErrorTypes =
  | "internal"
  | "invalid-argument"
  | "not-found"
  | "permission-denied"
  | "unauthenticated";

/**
 * Throw an error in an HTTP function
 * @param {Response} res Response object
 * @param {ErrorTypes} errorType The type of error to return
 * @param {string} message A custom error message
 * @return {Response<any> | undefined}
 */
const httpError = (res: Response, errorType: ErrorTypes, message?: string) => {
  switch (errorType) {
    case "internal":
      return res.status(500).json({
        code: 500,
        message: message || "Internal Error",
      });
    case "invalid-argument":
      return res.status(400).json({
        code: 400,
        message: message || "Bad Request",
      });
    case "not-found":
      return res.status(400).json({
        code: 404,
        message: message || "Not Found",
      });
    case "permission-denied":
      return res.status(403).json({
        code: 403,
        message: message || "Forbidden",
      });
    case "unauthenticated":
      return res.status(401).json({
        code: 401,
        message: message || "Unauthorized",
      });
    default:
      return;
  }
};

export default httpError;
