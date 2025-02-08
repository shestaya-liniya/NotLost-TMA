import { useLaunchParams } from "@telegram-apps/sdk-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

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

  const navigate = useNavigate();
  const lp = useLaunchParams();

  useEffect(() => {
    if (!lp.initData?.user) return;
    console.log(state);

    if (state.state === "ready") {
      state.signUp(lp.initData.user.username || lp.initData.user.id.toString());
      navigate("/tab-bar");
    }
  }, [state]);

  if (state.state === "loading") return <div>Loading</div>;
}
