import { useDemoAuth } from "jazz-react";
import { JazzProvider } from "jazz-react";
import { JazzAccount } from "./schema";
import { AutoSignIn } from "./auto-sign-in-jazz";

export function JazzAndAuth({ children }: { children: React.ReactNode }) {
  const [auth, state] = useDemoAuth();

  return (
    <>
      <JazzProvider
        auth={auth}
        peer={import.meta.env.VITE_JAZZ_PEER_URL}
        AccountSchema={JazzAccount}
      >
        {children}
      </JazzProvider>
      {state.state !== "signedIn" && <AutoSignIn state={state} />}
    </>
  );
}
