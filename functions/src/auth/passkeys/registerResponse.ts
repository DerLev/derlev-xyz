import type {HttpFunction} from "@google-cloud/functions-framework";
import allowMethods from "../../helpers/allowMethods";
import httpAuth from "../../helpers/httpAuth";
import type {RegistrationResponseJSON} from "@simplewebauthn/typescript-types";
import * as Joi from "joi";
import httpError from "../../helpers/httpError";
import {firestore} from "../../helpers/gCloudClients";
import firestoreConverter from "../../helpers/firestoreConverter";
import type {
  PasskeyChallengesCollection,
  PasskeyCredentialsCollection,
} from "../../../types/firestore";
import {verifyRegistrationResponse} from "@simplewebauthn/server";
import webauthnConfig from "../../helpers/webauthnConfig";
import {FieldValue} from "@google-cloud/firestore";

interface RegisterResponseQueryParams {
  docId: string;
}

const registerResponseQueryParams = Joi.object<RegisterResponseQueryParams>({
  docId: Joi.string().required(),
}).unknown(true);

/* eslint-disable-next-line valid-jsdoc */
/**
 * Register a new FIDO2 credential (Passkey)
 * @description this endpoint saves the pubkey from the completed registration in Firestore
 */
export const registerResponse: HttpFunction = async (req, res) => {
  /* Only allow HTTP POST */
  allowMethods(req, res, ["POST"]);

  /* Authenticate the user */
  const user = await httpAuth(req, res);

  /* Validate the query params */
  const {value: query, error} = registerResponseQueryParams.validate(req.query);
  if (error)
    return httpError(res, "invalid-argument", error.details[0].message);

  const credential: RegistrationResponseJSON = req.body;

  try {
    /* Get the registration challenge from Firestore */
    const passkeyChallengeDoc = firestore
      .collection("passkeyChallenges")
      .withConverter(firestoreConverter<PasskeyChallengesCollection>())
      .doc(query.docId);
    const passkeyChallengeData = (await passkeyChallengeDoc.get()).data();

    /* Error if challenge does not exist, is not for registration, or not from the current user */
    if (!passkeyChallengeData || passkeyChallengeData.action !== "register")
      return httpError(res, "invalid-argument");
    if (passkeyChallengeData.uid !== user.uid)
      return httpError(res, "unauthenticated");

    /* Verify the newly registered FIDO credential */
    const {verified, registrationInfo} = await verifyRegistrationResponse({
      expectedChallenge: passkeyChallengeData.challenge,
      expectedRPID: webauthnConfig.rpID,
      response: credential,
      expectedOrigin: webauthnConfig.origin,
      requireUserVerification: true,
    });

    /* Fail if verification failes */
    if (!verified || !registrationInfo)
      return httpError(res, "invalid-argument");

    /* Get a Firestore doc for the new FIDO cred */
    const passkeyCredentialDoc = firestore
      .collection("passkeyCredentials")
      .withConverter(firestoreConverter<PasskeyCredentialsCollection>())
      .doc(credential.id);

    /* Save the pubkey and counter in Firestore */
    await passkeyCredentialDoc.create({
      counter: registrationInfo.counter,
      credId: credential.id,
      credPublicKey: registrationInfo.credentialPublicKey,
      name: "Passkey",
      timestamp: FieldValue.serverTimestamp(),
      uid: user.uid,
      credIdBytes: registrationInfo.credentialID,
    });

    /* Delete the registration challenge */
    await passkeyChallengeDoc.delete();

    /* Send 200 OK to client */
    return res
      .status(200)
      .json({code: 200, message: "Credential successfully added!"});
  } catch (err) {
    console.error(err);
    return httpError(res, "internal");
  }
};
