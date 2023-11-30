import { useState, useEffect } from "react";
import supabase from "./supabase";
import { Session } from "@supabase/supabase-js";
import toast from "react-hot-toast";

const useAuth = () => {
  // セッションの有無でログイン状態を管理
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const authListener = supabase.auth.onAuthStateChange((_, session) => {
      setSession(session);
    });

    return () => {
      authListener.data.subscription.unsubscribe(); // Unsubscribe when component unmounts
    };
  }, []);

  // サインイン・ログイン処理
  const signIn = async (email: string, password: string) => {
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (signInError) {
        toast("パスワード・メールアドレスをご確認ください。", {
          duration: 2500,
        });
        return;
      }

      toast.success("サインインしました！", { duration: 2500 });
    } catch (error) {
      console.error("エラーが発生しました", error);
      toast.error("予期しないエラーが発生しました", { duration: 3000 });
    }
  };

  // サインアウト処理
  const signOut = async () => {
    await supabase.auth.signOut();
    toast.success("サインアウトしました！", { duration: 2500 });
  };

  // パスワード変更処理
  const changePassword = async () => {
    const { data, error: chagePassError } = await supabase.auth.updateUser({
      password: "new_password",
    });
    if (chagePassError) {
      toast.error("パスワード変更に失敗しました", { duration: 10000 });
      console.log("chagePassErrorです", chagePassError);
      return;
    }
    toast("パスワード変更成功");
  };

  return { session, signIn, signOut, changePassword };
};

export default useAuth;
