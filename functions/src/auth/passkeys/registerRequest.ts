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

export const registerRequest: HttpFunction = async (req, res) => {
  allowMethods(req, res, ["POST"]);

  const user = await httpAuth(req, res);

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
    console.error(err);
    return httpError(res, "internal");
  }
};
