// Remplace par la configuration de ton projet Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBHObOo2McUBg5UerkrQxMl7GEwGJnNiBw",
  authDomain: "gregoire-ballandras.firebaseapp.com",
  databaseURL: "https://gregoire-ballandras-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "gregoire-ballandras",
  storageBucket: "gregoire-ballandras.firebasestorage.app",
  messagingSenderId: "1095184130753",
  appId: "1:1095184130753:web:a7ff3b5e7bf6facdd16a40",
  measurementId: "G-XX39HNRM4H"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
