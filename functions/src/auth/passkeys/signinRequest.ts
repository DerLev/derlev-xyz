import type {HttpFunction} from "@google-cloud/functions-framework";
import allowMethods from "../../helpers/allowMethods";
import {generateAuthenticationOptions} from "@simplewebauthn/server";
import {firestore} from "../../helpers/gCloudClients";
import firestoreConverter from "../../helpers/firestoreConverter";
import {PasskeyChallengesCollection} from "../../../types/firestore";
import httpError from "../../helpers/httpError";
import {FieldValue} from "@google-cloud/firestore";

/* eslint-disable-next-line valid-jsdoc */
/**
 * Authenticate a user with a FIDO2 credential (Passkey)
 * @description this endpoint creates an auth challenge and sends it to the client
 */
export const signinRequest: HttpFunction = async (req, res) => {
  /* Only allow HTTP POST */
  allowMethods(req, res, ["POST"]);

  /* Generate the auth challenge */
  const options = generateAuthenticationOptions({
    userVerification: "preferred",
  });

  /* Get a Firebase doc for the challenge */
  const challengeDoc = firestore
    .collection("passkeyChallenges")
    .withConverter(firestoreConverter<PasskeyChallengesCollection>())
    .doc();

  try {
    /* Save the challenge in Firestore */
    await challengeDoc.create({
      challenge: options.challenge,
      timestamp: FieldValue.serverTimestamp(),
      action: "authenticate",
    });

    /* Send challenge to client */
    return res
      .status(200)
      .json({authentication: options, docId: challengeDoc.id});
  } catch (err) {
    console.error(err);
    return httpError(res, "internal");
  }
};
