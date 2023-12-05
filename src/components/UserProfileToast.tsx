import useAuth from "@/utils/AuthStateHandler";
import ThemeChanger from "./ThemeChanger";
import { useState } from "react";

const UserProfileToast = ({
  displayName,
  closeProfile,
}: {
  displayName: string;
  closeProfile: () => void;
}) => {
  const { session } = useAuth();
  const [changeTheme, setChangeTheme] = useState<boolean>(false);
  return (
    session && (
      <div className="stats shadow border-2 p-5">
        <div className="w-fit">
          <div className="flex justify-between mb-2">
            <div className="font-sans tracking-wide">ADMIN</div>
            <button
              className="btn btn-xs border-1 border-white"
              onClick={() => setChangeTheme(!changeTheme)}
            >
              Theme
            </button>
          </div>
          <div className="cursor-pointer" onClick={() => closeProfile()}>
            <div className="text-center text-xl font-semibold whitespace-nowrap tracking-wide">
              &nbsp;{displayName}
            </div>
            <div className="stat-desc text-right mt-2 tracking-tight">
              オンライン中🟢
            </div>
          </div>
        </div>
        {changeTheme && (
          <div className="absolute mt-1.5 top-32 right-1 text-gray-800 bg-violet-200 rounded-xl">
            <ThemeChanger />
          </div>
        )}
      </div>
    )
  );
};

export default UserProfileToast;
