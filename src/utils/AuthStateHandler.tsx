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

  const signUp = async (
    email: string,
    password: string,
    displayName: string
    // userId: string,
    // userName: string
  ) => {
    // サインアップ処理
    try {
      // ユーザーID がユニークかどうかチェック
      // const { data: allUserId } = await supabase
      //   .from("profiles")
      //   .select("*")
      //   .eq("user_id", userId);

      // if (allUserId) {
      //   return toast.error("そのIDは使えません");
      // }

      // 登録済みのメアドか確認
      // const {
      //   data: { users },
      //   error: allUsers,
      // } = await supabase.auth.admin.listUsers({
      //   page: 1,
      //   perPage: 1000,
      // });

      // サインアップ処理
      const { data: signUpData, error: signUpError } =
        await supabase.auth.signUp({
          email: email,
          password: password,
          options: {
            data: {
              display_name: displayName,
            },
          },
        });

      console.log("data", signUpData);

      if (signUpError) {
        toast.error(`signUpError ${signUpError.message}`, { duration: 2000 });
        console.log("signUpError", signUpError);
        return toast.error("入力内容をご確認ください", { duration: 2000 });
      }

      toast.success("登録に成功しました。メール認証をしてください", {
        duration: 2000,
      });

      // ログイン処理
      // const { error: signInError } = await supabase.auth.signInWithPassword({
      //   email: email,
      //   password: password,
      // });

      // if (signInError) {
      //   toast.error(`サインイン中にエラーが発生しました ${signInError}`, {
      //     duration: 2000,
      //   });
      //   console.log("signInError", signInError);
      //   return;
      // }

      // サインアップ成功後に user_profiles テーブルに挿入
      // const { data: userData, error } = await supabase
      //   .from("user_profiles")
      //   .insert({
      //     user_id: userId,
      //     user_name: userName,
      //   });

      // if (error) {
      //   return toast.error("ユーザー情報の登録中にエラーが発生しました", {
      //     duration: 2000,
      //   });
      // }

      // toast.success("ログインに成功しました", { duration: 2000 });
    } catch (error) {
      console.error("エラーが発生しました", error);
      toast.error("予期しないエラーが発生しました", { duration: 2000 });
    }
  };

  // サインイン・ログイン処理
  const signIn = async (email: string, password: string) => {
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      if (signInError)
        return toast.error("入力内容をご確認ください", { duration: 2000 });

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
      toast.error("パスワード変更に失敗しました", { duration: 2000 });
      console.log("chagePassErrorです", chagePassError);
      return;
    }
    toast("パスワード変更成功");
  };

  return { session, signUp, signIn, signOut, changePassword };
};

export default useAuth;
