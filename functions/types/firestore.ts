export interface PasskeyChallengesCollection {
  challenge: string;
  timestamp: import("@google-cloud/firestore").Timestamp;
  uid?: string;
  action: "register" | "authenticate";
}

export interface PasskeyCredentialsCollection {
  uid: string;
  timestamp: import("@google-cloud/firestore").Timestamp;
  credId: string;
  credIdBytes: Uint8Array;
  credPublicKey: Uint8Array;
  counter: number;
  name: string;
}
