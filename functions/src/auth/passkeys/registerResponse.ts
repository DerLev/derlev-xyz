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

export const registerResponse: HttpFunction = async (req, res) => {
  allowMethods(req, res, ["POST"]);

  const user = await httpAuth(req, res);

  const {value: query, error} = registerResponseQueryParams.validate(req.query);
  if (error)
    return httpError(res, "invalid-argument", error.details[0].message);

  const credential: RegistrationResponseJSON = req.body;

  try {
    const passkeyChallengeDoc = firestore
      .collection("passkeyChallenges")
      .withConverter(firestoreConverter<PasskeyChallengesCollection>())
      .doc(query.docId);
    const passkeyChallengeData = (await passkeyChallengeDoc.get()).data();

    if (!passkeyChallengeData) return httpError(res, "internal");
    if (passkeyChallengeData.uid !== user.uid)
      return httpError(res, "unauthenticated");

    const {verified, registrationInfo} = await verifyRegistrationResponse({
      expectedChallenge: passkeyChallengeData.challenge,
      expectedRPID: webauthnConfig.rpID,
      response: credential,
      expectedOrigin: webauthnConfig.origin,
    });

    if (!verified || !registrationInfo)
      return httpError(res, "invalid-argument");

    const passkeyCredentialDoc = firestore
      .collection("passkeyCredentials")
      .withConverter(firestoreConverter<PasskeyCredentialsCollection>())
      .doc(credential.id);

    await passkeyCredentialDoc.create({
      counter: registrationInfo.counter,
      credId: credential.id,
      credPublicKey: registrationInfo.credentialPublicKey,
      name: "Passkey",
      timestamp: FieldValue.serverTimestamp(),
      uid: user.uid,
      credIdBytes: registrationInfo.credentialID,
    });

    await passkeyChallengeDoc.delete();

    return res
      .status(200)
      .json({code: 200, message: "Credential successfully added!"});
  } catch (err) {
    console.error(err);
    return httpError(res, "internal");
  }
};
