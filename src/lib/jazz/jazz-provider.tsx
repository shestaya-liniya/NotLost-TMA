import { createJazzReactApp, DemoAuthBasicUI, useDemoAuth } from "jazz-react";
import { JazzAccount } from "./schema";

const Jazz = createJazzReactApp({
  AccountSchema: JazzAccount,
});

export const { useAccount, useCoState } = Jazz;

export function JazzAndAuth({ children }: { children: React.ReactNode }) {
  const [auth, state] = useDemoAuth();

  return (
    <>
      <Jazz.Provider auth={auth} peer={import.meta.env.VITE_JAZZ_PEER_URL}>
        {children}
      </Jazz.Provider>
      {state.state !== "signedIn" && (
        <DemoAuthBasicUI appName="NotLost" state={state} />
      )}
    </>
  );
}
