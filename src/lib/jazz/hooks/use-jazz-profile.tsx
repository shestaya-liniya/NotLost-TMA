import { useAccount } from "jazz-react";

export const useJazzProfile = () => {
  const { me } = useAccount();

  return me?.profile;
};
