import { useJazzProfileContext } from "@/lib/jazz/jazz-provider";

export const getTelegramSession = () => localStorage.getItem("session");

export const useTelegramSession = () => {
  const { jazzProfile } = useJazzProfileContext();

  const setSession = (session: string) => {
    jazzProfile.telegramSync = true;
    localStorage.setItem("session", session);
  };

  const deleteSession = () => {
    jazzProfile.telegramSync = false;
    localStorage.removeItem("session");
  };

  const signedIn = jazzProfile.telegramSync;

  return { setSession, deleteSession, signedIn };
};
