import { JazzAccount, RootUserProfile } from "./schema";
import { createContext, ReactNode, useContext, useState } from "react";
import { useJazzProfile } from "./hooks/use-jazz-profile";
import { JazzProvider, usePassphraseAuth } from "jazz-react";
import { cloudStorage } from "@telegram-apps/sdk-react";
import { wordlist } from "./wordlist";

export function JazzAndAuth({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JazzProvider
        AccountSchema={JazzAccount}
        sync={{ peer: import.meta.env.VITE_JAZZ_PEER_URL }}
      >
        <JazzProfileProvider>{children}</JazzProfileProvider>
      </JazzProvider>
    </>
  );
}

declare module "jazz-react" {
  interface Register {
    Account: JazzAccount;
  }
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

  const auth = usePassphraseAuth({
    wordlist: wordlist,
  });

  const [logged, setLogged] = useState(false);

  if (!logged) {
    if (import.meta.env.MODE === "development") {
      const passkey = localStorage.getItem("passkey");
      if (passkey) {
        auth.logIn(passkey).then(() => {
          setLogged(true);
        });
      } else {
        const generatedPassphrase = auth.generateRandomPassphrase();
        localStorage.setItem("passkey", generatedPassphrase);
        auth.registerNewAccount(generatedPassphrase, "My account");
      }
    } else {
      console.log(
        "CLOUD STORAGE AVAILABLE",
        cloudStorage.getItem.isAvailable()
      );

      cloudStorage.getItem("passkey").then((val) => {
        console.log("CLOUD STORAGE PASSKEY", val);

        if (val.length > 0) {
          try {
            auth.logIn(val).then(() => {
              setLogged(true);
            });
          } catch (e) {
            const generatedPassphrase = auth.generateRandomPassphrase();
            cloudStorage.setItem("passkey", generatedPassphrase);
            auth.registerNewAccount(generatedPassphrase, "My account");
          }
        }
      });
    }
  }

  if (!logged) return <div>Loadinggg...</div>;
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
