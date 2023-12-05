import useAuth from "@/utils/AuthStateHandler";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const SignOutButton = () => {
  const { signOut, session } = useAuth();
  const router = useRouter();
  const handleClick = () => {
    if (session) {
      signOut();
    } else if (!session) {
      router.push("/");
    } else {
      toast.error("予期せぬエラーが発生しました");
    }
  };

  return (
    <div
      className="tooltip tooltip-info tooltip-left mt-0.5 mr-0.5"
      data-tip={`${session ? "SignOut?" : "BackToTop?"}`}
    >
      <button className="btn btn-square btn-outline" onClick={handleClick}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
};

export default SignOutButton;
