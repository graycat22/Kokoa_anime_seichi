import useAuth from "@/utils/AuthStateHandler";

const UserProfileToast = ({
  displayName,
  closeProfile,
}: {
  displayName: string;
  closeProfile: () => void;
}) => {
  const { session } = useAuth();
  return (
    session && (
      <div
        className="stats shadow bg-violet-200 p-5"
        onClick={() => closeProfile()}
      >
        <div className="w-fit">
          <div className="font-sans tracking-wide">ADMIN</div>
          <div className="text-center text-xl font-semibold whitespace-nowrap tracking-wide">
            &nbsp;{displayName}
          </div>
          <div className="stat-desc text-right mt-2 tracking-tight">
            オンライン中🟢
          </div>
        </div>
      </div>
    )
  );
};

export default UserProfileToast;
