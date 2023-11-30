import useAuth from "@/utils/AuthStateHandler";

const SignOutButton = () => {
  const { signOut } = useAuth();
  return (
    <button onClick={signOut} className="bg-cyan-500 mx-2">
      サインアウト
    </button>
  );
};

export default SignOutButton;
