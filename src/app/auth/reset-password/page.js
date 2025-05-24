import ClientResetPassword from "./ClientResetPassword";

export const metadata = {
  title: "Reset Password",
  description: "Reset your password to regain access to your account.",
};

export default function ResetPasswordPage() {
  return <ClientResetPassword />;
}
