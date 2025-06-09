import { Suspense } from "react";
import ClientLogin from "./ClientLogin";

export const metadata = {
  title: "Login",
  description: "User login page",
};

export default function LoginPage() {
  return (
    <Suspense>
      <ClientLogin />
    </Suspense>
  );
}
