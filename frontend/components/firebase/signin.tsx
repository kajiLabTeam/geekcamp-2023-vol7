import React from "react";
import { useEffect } from "react";
import { auth } from "@/components/firebase/init";
import { onAuthStateChanged } from "firebase/auth";
import { signInWithRedirect } from "firebase/auth";
import { getRedirectResult, GoogleAuthProvider } from "firebase/auth";
import { signOut } from "firebase/auth";

export default function Signin() {
  const provider = new GoogleAuthProvider();
  const clickLogin = function () {
    signInWithRedirect(auth, provider);
  };

  useEffect(() => {
    getRedirectResult(auth)
      .then((result) => {
        console.log(result);
        if (result !== null) {
          const credential = GoogleAuthProvider.credentialFromResult(result);
          if (credential === null) return;
          const token = credential.accessToken;
          console.log(token);
          const user = result.user;
          console.log(user);
          console.log(user.uid);
        }
      })
      .catch((error) => {
        console.error(error);
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.email;
        console.error(errorCode);
        console.error(errorMessage);
        console.error(email);
      });
  }, []);

  const checkLogint = function () {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        const email = user.email;
        console.log(uid);
        console.log(email);
      } else {
        console.log("signed out");
      }
    });
  };
  checkLogint();
  const clickLogout = async function () {
    signOut(auth)
      .then(() => {
        console.log("ログアウトしました");
      })
      .catch((error) => {
        console.log(`ログアウト時にエラーが発生しました (${error})`);
      });
  };

  return (
    <div>
      <h1>ログイン Google</h1>
      <div>
        <button onClick={() => clickLogin()}>Login</button>
      </div>
      <hr />
      <hr />
      <button onClick={() => clickLogout()}>Logout</button>
    </div>
  );
}
