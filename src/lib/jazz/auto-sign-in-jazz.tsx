//import { useRouter } from "@tanstack/react-router";
import { useEffect } from "react";
import { useLaunchParams } from "@telegram-apps/sdk-react";

type DemoAuthState = (
  | {
      state: "uninitialized";
    }
  | {
      state: "loading";
    }
  | {
      state: "ready";
      existingUsers: string[];
      signUp: (username: string) => void;
      logInAs: (existingUser: string) => void;
    }
  | {
      state: "signedIn";
      logOut: () => void;
    }
) & {
  errors: string[];
};

export function AutoSignIn({ state }: { state: DemoAuthState }) {
  if (!state) return;

  //const router = useRouter();
  const lp = useLaunchParams();

  useEffect(() => {
    if (!lp.initData?.user) return;

    if (state.state === "ready") {
      state.signUp(lp.initData.user.username || lp.initData.user.id.toString());
      //router.navigate({ to: DialogsRoute.to });
    }
  }, [state]);

  if (state.state === "loading") return <div>Loading</div>;
}
