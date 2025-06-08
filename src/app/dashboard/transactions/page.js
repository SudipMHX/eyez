import TransactionsClient from "./transactions-client";

export const metadata = {
  title: "Manage All Transactions",
  description: "Manage your application settings and data.",
};

export default function TransactionsPage() {
  return <TransactionsClient />;
}
