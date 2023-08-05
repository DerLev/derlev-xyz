export type PasskeyCredentialsCollection<T = {}> = T & {
  uid: string;
  timestamp: import("firebase/firestore").Timestamp;
  credId: string;
  credIdBytes: Uint8Array;
  credPublicKey: Uint8Array;
  counter: number;
  name: string;
}
