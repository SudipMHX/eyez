import ClientLogin from "./login/ClientLogin";

export const metadata = {
  title: "Login",
  description: "User login page",
};

export default function AuthPage() {
  return <ClientLogin />;
}
