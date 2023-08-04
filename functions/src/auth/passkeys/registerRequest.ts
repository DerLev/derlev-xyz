import type {HttpFunction} from "@google-cloud/functions-framework";
import allowMethods from "../../helpers/allowMethods";
import {firestore} from "../../helpers/gCloudClients";
import {generateRegistrationOptions} from "@simplewebauthn/server";
import firestoreConverter from "../../helpers/firestoreConverter";
import type {PasskeyChallengesCollection} from "../../../types/firestore";
import {FieldValue} from "@google-cloud/firestore";

export const registerRequest: HttpFunction = async (req, res) => {
  allowMethods(req, res, ["POST"]);

  const registration = generateRegistrationOptions({
    rpID: "admin.derlev.xyz",
    rpName: "derlev.xyz",
    userID: "DFclDkv7eGSL3LiKx3zh5Rb9LjD3",
    userName: "Levin Schroeren",
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
    });

    return res.status(200).json({registration, docId: challengeDoc.id});
  } catch (err) {
    return res.status(500).json({code: 500, message: JSON.stringify(err)});
  }
};
