import type {HttpFunction} from "@google-cloud/functions-framework";

export const signinRequest: HttpFunction = (req, res) => {
  res.json({message: "Hello World!"});
};
