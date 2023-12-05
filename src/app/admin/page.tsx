"use client";

import { useEffect, useState } from "react";
import useAuth from "@/utils/AuthStateHandler";
import SignOutButton from "@/components/HookForms/SignOutButton";
import { Toaster } from "react-hot-toast";
import MeccaTable from "@/components/Admin-UI/MeccaTable";
import Image from "next/image";
import BottomButton from "@/components/BottomButton";
import LoginOrRegisterModal from "@/components/HookForms/LoginAndRegister";
import UserProfileToast from "@/components/UserProfileToast";
import ThemeChanger from "@/components/ThemeChanger";

const Admin = () => {
  const { session } = useAuth();
  const [nowLoading, setNowLoading] = useState<boolean>(true);
  const [updateTable, setUpdateTable] = useState<number>(0); // 初期値を 0 の識別子に変更
  const [isReversed, setIsReversed] = useState<boolean>(false);
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);
  const [isProfileShown, setIsProfileShown] = useState<boolean>(false);

  // Tableコンポーネントの再レンダリングをトリガーする関数
  const triggerTableReverse = () => {
    setUpdateTable((prevState) => prevState + 1); // 識別子を更新して再レンダリングをトリガー
  };

  const triggerDeleteMecca = () => {
    setIsConfirmed(!isConfirmed);
  };

  // Table 内でデータをソートすることを要求する関数
  const sortData = () => {
    setIsReversed(!isReversed);
  };

  useEffect(() => {
    setNowLoading(false);
  }, [session]);

  console.log("TOKEN", session?.access_token.slice(0, 15));
  console.log("EMAIL", session?.user.email);

  console.log("SESSION", session?.user.user_metadata.display_name);

  // ローディング画面
  if (nowLoading) {
    return (
      <>
        <div className="toast toast-top toast-center">
          <div className="alert alert-info bg-white">
            <span>Now Loading...</span>
          </div>
        </div>
        <BottomButton
          onSort={sortData}
          deleteCheckedMecca={triggerDeleteMecca}
          triggerTableReverse={triggerTableReverse}
        />
      </>
    );
  }

  return (
    <div>
      <div id="header" className="flex justify-between">
        <button
          className="-mb-1"
          onClick={() => setIsProfileShown(!isProfileShown)}
        >
          <div className="avatar -z-20">
            <div className="mask mask-squircle w-12 h-12 mt-0.5">
              <Image
                src="/Chuachan.png"
                alt="I am Chua!"
                width={88}
                height={88}
                priority={false}
              />
            </div>
          </div>
        </button>
        <div className="flex items-center font-semibold tracking-tight pt-2">
          <p
            className="cursor-pointer tooltip tooltip-bottom pl-3"
            data-tip="秘密の聖地データベース"
          >
            MECCA DATABASE
          </p>
        </div>
        <div>
          <SignOutButton />
        </div>
      </div>
      <Toaster />
      <div className="relative z-10">
        <div
          className={`absolute user-profile-toast left-10 z-50 ${
            isProfileShown ? "active" : ""
          }`}
        >
          {isProfileShown && (
            <UserProfileToast
              displayName={session?.user.user_metadata.display_name}
              closeProfile={() => setIsProfileShown(!isProfileShown)}
            />
          )}
        </div>
      </div>
      {!session && <LoginOrRegisterModal />}
      {session ? (
        <MeccaTable
          key={updateTable}
          isReversed={isReversed}
          isConfirmed={isConfirmed}
        />
      ) : null}
      {session ? (
        <BottomButton
          onSort={sortData}
          triggerTableReverse={triggerTableReverse}
          deleteCheckedMecca={triggerDeleteMecca}
        />
      ) : null}
    </div>
  );
};

export default Admin;
