import { useAccount } from "jazz-react";
import { Resolved } from "jazz-tools";
import { JazzFolder } from "../schema";
export type ResolvedFolder = Resolved<
  JazzFolder,
  { dialogs: { $each: true }; nestedFolders: { $each: true } }
>;

export const useJazzProfile = () => {
  const { me } = useAccount({
    resolve: {
      root: {
        folders: {
          $each: { dialogs: { $each: true }, nestedFolders: { $each: true } },
        },
      },
    },
  });

  if (!me) return;

  return me.root;
};
