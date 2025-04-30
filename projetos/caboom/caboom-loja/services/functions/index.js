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
import { db } from "../../util/initfirebase";

export const getDrops = async () => {
  return new Promise(async (resolve, reject) => {
    const q = query(collection(db, "drops"), where("active", "==", true));
    var data = [];

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      data.push(doc.data());
    });
    resolve(data);
  });
};

export const getBrands = async (el) => {
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
