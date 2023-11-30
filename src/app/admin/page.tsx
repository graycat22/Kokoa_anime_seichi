"use client";

import { useEffect, useState } from "react";
import SignIn from "@/components/SignIn";
import SignUp from "@/components/SignUp";
import Link from "next/link";
import useAuth from "@/utils/AuthStateHandler";
import SignOutButton from "@/components/SignOutButton";
import { Toaster } from "react-hot-toast";

const Admin = () => {
  const { session } = useAuth();
  const [nowLoading, setNowLoading] = useState(true);

  useEffect(() => {
    setNowLoading(false);
  }, [session]);

  console.log("TOKEN", session?.access_token.slice(0, 15));
  console.log("EMAIL", session?.user.email);

  if (nowLoading) {
    return <p>nowLoading</p>;
  }

  return (
    <div>
      <Toaster />
      <Link href="/">トップへ戻る</Link>
      {session ? (
        <SignOutButton />
      ) : (
        <>
          <SignUp />
          <SignIn />
        </>
      )}
    </div>
  );
};

export default Admin;
