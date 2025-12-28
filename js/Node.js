import admin from "firebase-admin";

admin.initializeApp({
  credential: admin.credential.cert("firebase-key.json")
});

export async function hotmartWebhook(req, res) {
  const email = req.body.data.buyer.email;

  const user = await admin.auth().createUser({ email });

  await admin.firestore().collection('users').doc(user.uid).set({
    email,
    plan: "pro",
    createdAt: new Date()
  });

  res.sendStatus(200);
}
