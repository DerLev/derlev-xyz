import type {HttpFunction} from "@google-cloud/functions-framework";
import allowMethods from "../../helpers/allowMethods";
import {firestore} from "../../helpers/gCloudClients";
import {generateRegistrationOptions} from "@simplewebauthn/server";
import firestoreConverter from "../../helpers/firestoreConverter";
import type {PasskeyChallengesCollection} from "../../../types/firestore";
import {FieldValue} from "@google-cloud/firestore";
import httpAuth from "../../helpers/httpAuth";
import httpError from "../../helpers/httpError";

export const registerRequest: HttpFunction = async (req, res) => {
  allowMethods(req, res, ["POST"]);

  const user = await httpAuth(req, res);

  const registration = generateRegistrationOptions({
    rpID: "admin.derlev.xyz",
    rpName: "derlev.xyz",
    userID: user.uid,
    userName: user.email || user.uid,
    attestationType: "none",
    authenticatorSelection: {
      residentKey: "required",
      userVerification: "preferred",
    },
  });

  const challengeDoc = firestore
    .collection("passkeyChallenges")
    .withConverter(firestoreConverter<PasskeyChallengesCollection>())
    .doc();

  try {
    await challengeDoc.create({
      challenge: registration.challenge,
      timestamp: FieldValue.serverTimestamp(),
      uid: user.uid,
    });

    return res.status(200).json({registration, docId: challengeDoc.id});
  } catch (err) {
    return httpError(res, "internal");
  }
};
