import useAuth from "@/utils/AuthStateHandler";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";

const LoginOrRegisterModal = () => {
  const { session, signIn, signUp } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const handleToggleForm = () => {
    setIsLogin(!isLogin);
  };
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<LoginInputs>();
  const onSubmit: SubmitHandler<LoginInputs> = async (data) => {
    if (isLogin) {
      try {
        toast.loading("サインイン中…", { duration: 4000 });
        const { email, password } = data;
        await signIn(email, password);
        toast.success("サインインしました！", { duration: 2000 });
      } catch (error) {
        toast.error("サインインに失敗しました", { duration: 2000 });
      }
    } else {
      try {
        toast.loading("サインアップ中…", { duration: 1500 });
        const { email, password, displayName } = data;
        await signUp(email, password, displayName);
        toast.success("ようこそ！", { icon: "🛤️", duration: 1000 });
        setIsLogin(false);
      } catch (error) {
        toast.error("サインアップに失敗しました", { duration: 1300 });
      }
    }
  };

  const wrappedSubmit = handleSubmit(onSubmit);
  toast.promise(wrappedSubmit(), {
    loading: "Loading",
    success: "Got the data",
    error: "Error when fetching",
  });

  console.log("これ", watch("email"), watch("password"), errors);
  console.log("isLoggedIn?, session", session);

  return (
    <div>
      <Toaster />
      <div className="bg-white py-6 sm:py-8 lg:py-12 w-full">
        <div className="mx-auto max-w-screen-2xl px-4 md:px-8 w-fit">
          <h2 className="mb-4 text-center text-2xl font-extrabold tracking-wide text-gray-700 md:mb-8 lg:text-3xl">
            {isLogin ? "サインイン" : "サインアップ"}
          </h2>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mx-auto max-w-lg rounded-lg border"
          >
            <div className="flex flex-col gap-4 p-4 md:p-8">
              {!isLogin && (
                <div className="relative">
                  <label
                    htmlFor="displayName"
                    className="mb-2 inline-block text-sm text-gray-800 sm:text-base"
                  >
                    ディスプレイネーム
                  </label>
                  {errors.displayName && (
                    <div
                      className="absolute tooltip tooltip-open tooltip-error tooltip-right right-2 bottom-5 mr-2 sm:-right-3"
                      data-tip=""
                    ></div>
                  )}
                  <input
                    {...register("displayName", {
                      required: "ディスプレイネームは必須です",
                      minLength: {
                        value: 1,
                        message:
                          "ディスプレイネームは1文字以上で入力してください",
                      },
                      maxLength: {
                        value: 12,
                        message:
                          "ディスプレイネームは12文字以内で入力してください",
                      },
                      pattern: {
                        value: /^[a-zA-Z0-9_]+$/,
                        message:
                          "ディスプレイネームは英数字とアンダースコア(_)のみが許可されています",
                      },
                    })}
                    name="displayName"
                    type="text"
                    className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-violet-300 transition duration-100 focus:ring"
                  />
                  {errors.displayName && (
                    <p className="absolute right-0 mt-0.5 text-sm text-yellow-500">
                      {errors.displayName.message}
                    </p>
                  )}
                </div>
              )}

              <div className="relative">
                <label
                  htmlFor="email"
                  className="mb-2 inline-block text-sm text-gray-800 sm:text-base"
                >
                  メールアドレス
                </label>
                {errors.email && (
                  <div
                    className="absolute tooltip tooltip-open tooltip-error tooltip-right right-2 bottom-5 mr-2 sm:-right-3"
                    data-tip=""
                  ></div>
                )}
                <input
                  {...register("email", {
                    required: "メールアドレスは必須です",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                      message: "正しいメールアドレスを入力してください",
                    },
                  })}
                  name="email"
                  type="email"
                  className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-violet-300 transition duration-100 focus:ring"
                />
                {errors.email && (
                  <p className="absolute right-0 mt-0.5 text-sm text-yellow-500">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="mb-4 mt-0.5 relative">
                <label
                  htmlFor="password"
                  className="mb-2 inline-block text-sm text-gray-800 sm:text-base"
                >
                  パスワード
                </label>
                {errors.password && (
                  <div
                    className="absolute tooltip tooltip-open tooltip-error tooltip-right right-2 bottom-5 mr-2 sm:-right-3"
                    data-tip=""
                  ></div>
                )}
                <input
                  {...register("password", {
                    required: "パスワードは必須です",
                    minLength: {
                      value: 6,
                      message: "6文字以上で入力してください",
                    },
                  })}
                  name="password"
                  type="password"
                  className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-violet-300 transition duration-100 focus:ring"
                />
                {errors.password && (
                  <p className="absolute right-0 mt-0.5 text-sm text-yellow-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="block rounded-lg bg-violet-400 px-8 py-3 text-center text-sm font-bold text-gray-800 outline-none ring-violet-300 transition duration-300 hover:bg-violet-500 hover:text-slate-50 focus-visible:ring active:bg-violet-600 md:text-base"
              >
                {isLogin ? "サインイン" : "サインアップ"}
              </button>

              <div className="relative flex items-center justify-center">
                <span className="absolute inset-x-0 h-px bg-gray-300"></span>
                <span className="relative bg-white px-4 text-sm text-gray-400">
                  SNSアカウントで{isLogin ? "サインイン" : "サインアップ"}する
                </span>
              </div>

              <div className="flex items-center justify-center bg-gray-100 p-4">
                <p className="text-center text-sm text-gray-500">
                  アカウントを持っていませんか？
                  <a
                    onClick={handleToggleForm}
                    className="ml-2 text-violet-500 transition duration-200 hover:text-violet-700 hover:font-base active:text-violet-700 cursor-pointer"
                  >
                    {isLogin ? "登録" : "サインイン"}
                  </a>
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginOrRegisterModal;
