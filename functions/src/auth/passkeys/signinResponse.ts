import type {HttpFunction} from "@google-cloud/functions-framework";
import allowMethods from "../../helpers/allowMethods";
import type {AuthenticationResponseJSON} from "@simplewebauthn/typescript-types";
import * as Joi from "joi";
import httpError from "../../helpers/httpError";
import {verifyAuthenticationResponse} from "@simplewebauthn/server";
import webauthnConfig from "../../helpers/webauthnConfig";
import {firestore} from "../../helpers/gCloudClients";
import firestoreConverter from "../../helpers/firestoreConverter";
import type {
  PasskeyChallengesCollection,
  PasskeyCredentialsCollection,
} from "../../../types/firestore";
import auth from "../../helpers/firebaseAuth";

interface SigninResponseQueryParams {
  docId: string;
}

const signinResponseQueryParams = Joi.object<SigninResponseQueryParams>({
  docId: Joi.string().required(),
}).unknown(true);

/* eslint-disable-next-line valid-jsdoc */
/**
 * Authenticate a user with a FIDO2 credential (Passkey)
 * @description this endpoint verifies the credential and sends a FB custom token to the client
 */
export const signinResponse: HttpFunction = async (req, res) => {
  /* Only allow HTTP POST */
  allowMethods(req, res, ["POST"]);

  /* Validate query params */
  const {value: query, error} = signinResponseQueryParams.validate(req.query);
  if (error)
    return httpError(res, "invalid-argument", error.details[0].message);

  const credential: AuthenticationResponseJSON = req.body;

  try {
    /* Get the challenge doc */
    const passkeyChallengeDoc = firestore
      .collection("passkeyChallenges")
      .withConverter(firestoreConverter<PasskeyChallengesCollection>())
      .doc(query.docId);
    const passkeyChallengeData = await (await passkeyChallengeDoc.get()).data();

    /* Fail if challenge doc does not exist or if the challenge is for registering a new cred */
    if (!passkeyChallengeData || passkeyChallengeData.action !== "authenticate")
      return httpError(res, "invalid-argument");

    /* Get the credential's doc */
    const passkeyCredentialDoc = firestore
      .collection("passkeyCredentials")
      .withConverter(firestoreConverter<PasskeyCredentialsCollection>())
      .doc(credential.id);
    const passkeyCredentialData = await (
      await passkeyCredentialDoc.get()
    ).data();

    /* Fail if cred does not exist in Firestore */
    if (!passkeyCredentialData) return httpError(res, "invalid-argument");

    /* Verify the challenge with the cred's pubkey */
    const {verified, authenticationInfo} = await verifyAuthenticationResponse({
      response: credential,
      expectedOrigin: webauthnConfig.origin,
      expectedRPID: webauthnConfig.rpID,
      requireUserVerification: true,
      expectedChallenge: passkeyChallengeData.challenge,
      authenticator: {
        credentialPublicKey: passkeyCredentialData.credPublicKey,
        credentialID: passkeyCredentialData.credIdBytes,
        counter: passkeyCredentialData.counter,
      },
    });

    /* Fail if verification fails */
    if (!verified || !authenticationInfo)
      return httpError(res, "invalid-argument");

    /* Delete the challenge from Firestore */
    await passkeyChallengeDoc.delete();

    /* Update the counter of the cred in Firestore */
    await passkeyCredentialDoc.update({
      counter: authenticationInfo.newCounter,
    });

    /* Generate the custom token */
    const cred = await auth.createCustomToken(passkeyCredentialData.uid);

    /* Send the custom token to the client */
    return res.status(200).json({
      code: 200,
      message: "Successfully authenticated! Continue auth flow with token!",
      cred,
    });
  } catch (err) {
    console.error(err);
    return httpError(res, "internal");
  }
};
