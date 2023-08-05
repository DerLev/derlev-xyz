import type {HttpFunction} from "@google-cloud/functions-framework";
import allowMethods from "../../helpers/allowMethods";
import {firestore} from "../../helpers/gCloudClients";
import {generateRegistrationOptions} from "@simplewebauthn/server";
import firestoreConverter from "../../helpers/firestoreConverter";
import type {
  PasskeyChallengesCollection,
  PasskeyCredentialsCollection,
} from "../../../types/firestore";
import {FieldValue} from "@google-cloud/firestore";
import httpAuth from "../../helpers/httpAuth";
import httpError from "../../helpers/httpError";
import webauthnConfig from "../../helpers/webauthnConfig";

/* eslint-disable-next-line valid-jsdoc */
/**
 * Register a new FIDO2 credential (Passkey)
 * @description this endpoint creates a challenge and sends it for registration
 */
export const registerRequest: HttpFunction = async (req, res) => {
  /* Only allow POST requests */
  allowMethods(req, res, ["POST"]);

  /* Authenticate the user */
  const user = await httpAuth(req, res);

  /* Get all registered FIDO creds of the user */
  const passkeyCredentialsCollection = firestore
    .collection("passkeyCredentials")
    .withConverter(firestoreConverter<PasskeyCredentialsCollection>());
  const passkeyCredentialsQuery = await passkeyCredentialsCollection
    .where("uid", "==", user.uid)
    .get();
  const passkeyCredentialsDocs = await passkeyCredentialsQuery.docs.map(
    (doc) => {
      return doc.data();
    },
  );

  /* Create the registration challenge with excluded credentials */
  const registration = generateRegistrationOptions({
    rpID: webauthnConfig.rpID,
    rpName: webauthnConfig.rpName,
    userID: user.uid,
    userName: user.email || user.uid,
    attestationType: "none",
    authenticatorSelection: {
      residentKey: "required",
      userVerification: "preferred",
    },
    excludeCredentials: passkeyCredentialsDocs.length
      ? passkeyCredentialsDocs.map((doc) => ({
          id: doc.credIdBytes,
          type: "public-key",
        }))
      : [],
  });

  /* Get a Firestore doc for saving the challenge */
  const challengeDoc = firestore
    .collection("passkeyChallenges")
    .withConverter(firestoreConverter<PasskeyChallengesCollection>())
    .doc();

  try {
    /* Save the challenge in the Firestore doc */
    await challengeDoc.create({
      challenge: registration.challenge,
      timestamp: FieldValue.serverTimestamp(),
      uid: user.uid,
      action: "register",
    });

    /* Send challenge to client */
    return res.status(200).json({registration, docId: challengeDoc.id});
  } catch (err) {
    console.error(err);
    return httpError(res, "internal");
  }
};
