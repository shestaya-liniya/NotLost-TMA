import { useAccount } from "jazz-react";

export const useJazzProfile = () => {
  const { me } = useAccount({
    resolve: { root: { folders: { $each: true } } },
  });

  if (!me) return;

  return me.root;
};
