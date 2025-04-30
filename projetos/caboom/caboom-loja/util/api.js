import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDocs,
  getDoc,
  setDoc,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { db, provider, functions } from "./initfirebase";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { httpsCallable } from "firebase/functions";

export const get_drops = async () => {
  return new Promise(async (resolve, reject) => {
    const q = query(collection(db, "drops"), where("active", "==", true));
    var data = [];

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      data.push(doc.data());
    });
    console.log("data - ", data);
    resolve(data);
  });
};

export const get_brands = async (el) => {
  return new Promise(async (resolve, reject) => {
    var data = [];
    console.log("el =>", el);
    for (let index = 0; index < el.length; index++) {
      const element = el[index];
      const docRef = doc(db, "marcas", element.value);
      const docSnap = await getDoc(docRef);
      data.push(docSnap.data());
    }

    data = data.filter((v, i, a) => a.findIndex((v2) => v2.id === v.id) === i);

    resolve(data);
  });
};

export const get_drop = async (id) => {
  return new Promise(async (resolve, reject) => {
    const docRef = doc(db, "drops", id);
    const docSnap = await getDoc(docRef);
    resolve(docSnap.data());
  });
};

export const get_pieces = async (drop_id) => {
  return new Promise(async (resolve, reject) => {
    var data = [];
    const q = query(collection(db, "pieces"), where("dropId", "==", drop_id));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots

      data.push(doc.data());
    });
    resolve(data);
  });
};

export const get_piece = async (id) => {
  return new Promise(async (resolve, reject) => {
    const docRef = doc(db, "pieces", id);
    const docSnap = await getDoc(docRef);
    resolve(docSnap.data());
  });
};

export const googleLogin = () => {
  return new Promise(async (resolve, reject) => {
    const auth = getAuth();
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        resolve(user);
        // ...
      })
      .catch((error) => {
        // Handle Errors here.

        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  });
};

export const is_user_registered = async (id) => {
  return new Promise(async (resolve, reject) => {
    const docRef = doc(db, "users", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      resolve(docSnap.data());
    } else {
      reject("Usuário não registrado");
    }
  });
};
export const sign_out = () => {
  return new Promise((resolve, reject) => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        resolve(true);
        // Sign-out successful.
      })
      .catch((error) => {
        reject(error);
        // An error happened.
      });
  });
};

export const show_qr_code = () => {
  return new Promise((resolve, reject) => {
    const auth = getAuth();

    const fn = httpsCallable(functions, "generate_qr");
    var items = JSON.parse(localStorage.getItem("items"));
    var req = {};
    req.pieces = items;
    req.uid = auth.currentUser.uid;
    fn({ data: req })
      .then((res) => {
        console.log(res);
        resolve(res);
      })
      .catch((e) => {
        console.log("error - ", e);
        reject(e);
      });
  });
};

export const create_order = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const docRef = await addDoc(collection(db, "purchases"), data);
      const orderRef = doc(db, "purchases", docRef.id);

      await updateDoc(orderRef, {
        id: docRef.id,
      });
      resolve();
    } catch (error) {
      console.log("error - ", error);
      reject(error);
    }
  });
};

export const register = (data) => {
  return new Promise((resolve, reject) => {
    const auth = getAuth();

    if (data.uid === "") {
      createUserWithEmailAndPassword(auth, data.email, data.password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          data.uid = user.uid;
          console.log("veio aqui - ", user.uid, data, userCredential);
          delete data.password;
          setDoc(doc(db, "users", user.uid), data)
            .then(() => {
              resolve();
            })
            .catch((e) => {
              reject(e);
            });
          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          reject(error);

          // ..
        });
    } else {
      delete data.password;
      setDoc(doc(db, "users", data.uid), data)
        .then(() => {
          resolve();
        })
        .catch((e) => {
          reject(e);
        });
    }
  });
};

export const is_email_registered = async (email) => {
  return new Promise(async (resolve, reject) => {
    const q = query(collection(db, "users"), where("email", "==", email));
    var data = [];

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      data.push(doc.data());
    });
    resolve(data);
  });
};

export const login = async (email, password) => {
  return new Promise(async (resolve, reject) => {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        resolve(user);
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        reject(errorMessage);
      });
  });
};

export const get_orders = async (email) => {
  return new Promise(async (resolve, reject) => {
    var data = [];
    const q = query(
      collection(db, "purchases"),
      where("user.email", "==", email)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots

      data.push(doc.data());
    });
    resolve(data);
  });
};

export const get_order = async (id) => {
  return new Promise(async (resolve, reject) => {
    const docRef = doc(db, "purchases", id);
    const docSnap = await getDoc(docRef);
    resolve(docSnap.data());
  });
};
export const is_logged_in = async (id) => {
  return new Promise(async (resolve, reject) => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      resolve(true);
    } else {
      resolve(false);
    }
  });
};

export const get_brand = async (id) => {
  return new Promise(async (resolve, reject) => {
    const docRef = doc(db, "marcas", id);
    const docSnap = await getDoc(docRef);
    resolve(docSnap.data());
  });
};
