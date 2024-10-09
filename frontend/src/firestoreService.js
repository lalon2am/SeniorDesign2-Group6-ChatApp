//A function to store user data in Firestore

import { firestore } from './firebase'; // Adjust the import path as necessary
import { collection, doc, setDoc } from 'firebase/firestore';

const saveUserToFirestore = async (username, email, passwordHash) => {
  try {
    const usersRef = collection(firestore, 'users');
    const newUserRef = doc(usersRef); // Create a new document reference

    await setDoc(newUserRef, {
      username,
      email,
      password_hash: passwordHash,
      profile_pic_url: "",  // Optional
      status: "active",
      created_at: new Date() // Timestamp
    });

    console.log("User information stored successfully in Firestore.");
  } catch (error) {
    console.error("Error storing user information: ", error);
  }
};

export { saveUserToFirestore };