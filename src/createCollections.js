const { firestore } = require('./firebase'); // Import Firestore instance from firebase.js
const { collection, setDoc, doc } = require ('firebase/firestore');

// Create 'users' collection with a placeholder document
async function createUsersCollection() {
  try {
    await setDoc(doc(firestore, "users", "placeholder_user"), {
      username: "placeholder",
      email: "placeholder@example.com",
      password_hash: "hashed_password",
      profile_pic_url: "",
      status: "active",
      created_at: new Date()
    });
    console.log("Users collection created.");
  } catch (e) {
    console.error("Error creating users collection: ", e);
  }
}

// Create 'messages' collection with a placeholder document
async function createMessagesCollection() {
  try {
    await setDoc(doc(firestore, "messages", "placeholder_message"), {
      sender_id: "placeholder",
      receiver_id: "placeholder",
      group_id: null,
      message_body: "This is a placeholder message",
      message_type: "text",
      created_at: new Date(),
      is_deleted: false
    });
    console.log("Messages collection created.");
  } catch (e) {
    console.error("Error creating messages collection: ", e);
  }
}

// Create 'friend_requests' collection with a placeholder document
async function createFriendRequestsCollection() {
  try {
    await setDoc(doc(firestore, "friend_requests", "placeholder_request"), {
      sender_id: "placeholder",
      receiver_id: "placeholder",
      status: "pending",
      sent_at: new Date()
    });
    console.log("Friend requests collection created.");
  } catch (e) {
    console.error("Error creating friend requests collection: ", e);
  }
}

// Create 'groups' collection with a placeholder document
async function createGroupsCollection() {
  try {
    await setDoc(doc(firestore, "groups", "placeholder_group"), {
      group_name: "Placeholder Group",
      created_by: "placeholder",
      created_at: new Date(),
      group_members: {}  // You can later add members as subcollections
    });
    console.log("Groups collection created.");
  } catch (e) {
    console.error("Error creating groups collection: ", e);
  }
}

// Create 'blocked_users' collection with a placeholder document
async function createBlockedUsersCollection() {
  try {
    await setDoc(doc(firestore, "blocked_users", "placeholder_block"), {
      blocked_id: "placeholder",
      blocked_at: new Date()
    });
    console.log("Blocked users collection created.");
  } catch (e) {
    console.error("Error creating blocked users collection: ", e);
  }
}

// Call all functions to create collections
async function createCollections() {
  await createUsersCollection();
  await createMessagesCollection();
  await createFriendRequestsCollection();
  await createGroupsCollection();
  await createBlockedUsersCollection();
}

module.exports = {createCollections}; // Run this function to create the collections
