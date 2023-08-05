import * as admin from "firebase-admin";

/**
 * Initialize Firebase Auth/Identity Platform
 */

admin.initializeApp();

const auth = admin.auth();

export default auth;
