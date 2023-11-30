"use client";

import supabase from "@/utils/supabase";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const SignUp = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConf, setPasswordConf] = useState<string>("");

  console.log(email, password);

  // useEffect(() => {
  //   if (password !== passwordConf) {
  //     toast("パスワードが一致しません", { duration: 1000 });
  //   }
  // }, [password, passwordConf]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password || !passwordConf) {
      toast.error("入力が足りません", { duration: 1000 });
      return;
    }

    try {
      // サインアップ処理
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email,
        password: password,
      });

      console.log("data", data);

      if (signUpError) {
        toast.error(`signUpError ${signUpError}`, { duration: 10000 });
        console.log("signUpError", signUpError);
        return;
      }

      toast.success("登録に成功しました", { duration: 10000 });

      // ログイン処理
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (signInError) {
        toast.error(`signInError ${signInError}`, { duration: 10000 });
        console.log("signInError", signInError);
        return;
      }

      toast.success("ログインに成功しました", { duration: 10000 });
    } catch (error) {
      console.error("エラーが発生しました", error);
      toast.error("予期しないエラーが発生しました", { duration: 10000 });
    }
  };

  return (
    <div>
      <Toaster />
      <h1>Sign Up Page</h1>
      <form onSubmit={handleSignUp}>
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
        <div>
          <label>もう一度パスワードを入力してください</label>
          <input
            type="password"
            value={passwordConf}
            onChange={(e) => setPasswordConf(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:border-blue-500"
          />
        </div>
        <button className="font-semibold px-4 py-2 shadow-xl bg-slate-200 rounded-lg m-auto hover:bg-slate-100">
          送信
        </button>
      </form>
    </div>
  );
};

export default SignUp;
