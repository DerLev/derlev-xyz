import type {HttpFunction} from "@google-cloud/functions-framework";

export const registerResponse: HttpFunction = (req, res) => {
  res.json({message: "Hello World!"});
};
