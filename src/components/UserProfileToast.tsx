const UserProfileToast = ({
  displayName,
  closeProfile,
}: {
  displayName: string;
  closeProfile: () => void;
}) => {
  return (
    <div className="stats shadow bg-violet-200" onClick={() => closeProfile()}>
      <div className="stat w-44">
        <div className="stat-title font-sans tracking-wide">ADMIN</div>
        <div className="stat-value tracking-wide">&nbsp;{displayName}</div>
        <div className="stat-desc text-right mt-2 tracking-tight">
          オンライン中🟢
        </div>
      </div>
    </div>
  );
};

export default UserProfileToast;
