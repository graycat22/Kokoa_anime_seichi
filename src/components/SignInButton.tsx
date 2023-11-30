import useAuth from "@/utils/AuthStateHandler";

interface SignInButtonProps {
  email: string;
  password: string;
}

const SignInButton = (props: SignInButtonProps) => {
  const { signIn } = useAuth();
  const { email, password } = props;

  return (
    <button
      onClick={() => signIn(email, password)}
      className="bg-cyan-500 mx-2"
    >
      ログイン
    </button>
  );
};

export default SignInButton;
