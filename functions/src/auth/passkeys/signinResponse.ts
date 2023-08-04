import type {HttpFunction} from "@google-cloud/functions-framework";

export const signinResponse: HttpFunction = (req, res) => {
  res.json({message: "Hello World!"});
};
