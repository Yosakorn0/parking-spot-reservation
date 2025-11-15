import { auth } from "~/server/auth";
import Login from "./login";
import Home from "./home";

export default async function page() {
  const session = await auth();

  if (!session) {
    return <Login />;
  }

  return <Home />;
}
