"use client";

import AuthStateHandler from "@/utils/AuthStateHandler";
import { useState } from "react";
import { Toaster } from "react-hot-toast";
import SignOutButton from "./SignOutButton";
import SignInButton from "./SignInButton";

const SignIn = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { session } = AuthStateHandler();

  console.log("email, password", email, password);
  console.log("isLoggedIn?, session", session);

  return (
    <div>
      <Toaster />
      <div className="flex mt-20 items-end">
        <h1 className="mx-2">SignIn Page</h1>
        <div>
          <label>メールアドレスを入力してください</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:border-blue-500"
          />
          <div>
            <label>パスワードを入力してください</label>
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:border-blue-500"
          />
        </div>
        {!session && <SignInButton email={email} password={password} />}
        {session && <SignOutButton />}
      </div>
    </div>
  );
};

export default SignIn;
