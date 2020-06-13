import { atom, useRecoilState } from "recoil";
import { useEffect } from "react";
import firebase from "../firebase/clientApp";

export const radioAnswerWithName = (questionName: string) => {
  return atom({
    key: `radioAnswer-${questionName}`,
    default: "",
  });
};

export const checkboxAnswerWithName = (questionName: string) => {
  return atom({
    key: `checkboxAnswer-${questionName}`,
    default: [],
  });
};

export const otherTalkThemeAtom = atom({
  key: "talkTheme",
  default: "",
});

export const userAtom = atom({
  key: "user",
  default: { uid: "", displayName: "", email: "", photoUrl: "" },
});

export const userLoadingAtom = atom({
  key: "userLoading",
  default: false,
});

type User = {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
};

export const useUserState = (): [User, () => void, boolean] => {
  const [user, setUser] = useRecoilState(userAtom);
  const [loadingUser, setLoadingUser] = useRecoilState(userLoadingAtom);

  useEffect(() => {
    // Listen authenticated user
    const unsubscriber = firebase.auth().onAuthStateChanged(async (user) => {
      try {
        if (user) {
          // User is signed in.
          const { uid, displayName, email, photoURL } = user;
          const db = firebase.firestore();
          const userDocRef = db.doc(`users/${uid}`);
          const userDoc = await userDocRef.get();
          const reservationSnapshot = await userDocRef
            .collection("reservation")
            .get();
          const reservations = reservationSnapshot.docs.map((doc) =>
            doc.data()
          );
          //add user to firestore if no document.
          if (userDoc.data() === undefined) {
            await db
              .collection("users")
              .doc(uid)
              .set({ displayNameInApp: displayName, photoURL });
          }
          setUser({ uid, displayName, email, photoURL, reservations });
        } else setUser(null);
      } catch (error) {
        // Most probably a connection error. Handle appropriately.
      } finally {
        setLoadingUser(false);
      }
    });

    // Unsubscribe auth listener on unmount
    return () => unsubscriber();
  }, []);

  return [user, setUser, loadingUser];
};
