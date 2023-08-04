import type {HttpFunction} from "@google-cloud/functions-framework";

export const registerRequest: HttpFunction = (req, res) => {
  res.json({message: "Hello World!"});
};
