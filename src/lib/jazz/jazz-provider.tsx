import { createJazzReactApp, useDemoAuth } from "jazz-react";
import { JazzAccount, RootUserProfile } from "./schema";
import { createContext, ReactNode, useContext } from "react";
import { useJazzProfile } from "./hooks/use-jazz-profile";
import { AutoSignIn } from "./auto-sign-in-jazz";

const Jazz = createJazzReactApp({
  AccountSchema: JazzAccount,
});

export const { useAccount, useCoState } = Jazz;

export function JazzAndAuth({ children }: { children: React.ReactNode }) {
  const [auth, state] = useDemoAuth();

  return (
    <>
      <Jazz.Provider auth={auth} peer={import.meta.env.VITE_JAZZ_PEER_URL}>
        <JazzProfileProvider>{children}</JazzProfileProvider>
      </Jazz.Provider>
      {state.state !== "signedIn" && <AutoSignIn state={state} />}
    </>
  );
}

export interface JazzProfileContextType {
  jazzProfile: RootUserProfile;
}

// Create the context
const JazzProfileContext = createContext<JazzProfileContextType | undefined>(
  undefined
);

// Context Provider Component
export function JazzProfileProvider({ children }: { children: ReactNode }) {
  const jazzProfile = useJazzProfile();

  if (!jazzProfile) return null;
  return (
    <JazzProfileContext.Provider value={{ jazzProfile }}>
      {jazzProfile ? children : null}
    </JazzProfileContext.Provider>
  );
}

// Custom hook to use the context
export function useJazzProfileContext() {
  const context = useContext(JazzProfileContext);
  if (!context) {
    throw new Error(
      "useJazzProfileContext must be used within a JazzProfileProvider"
    );
  }
  return context;
}
