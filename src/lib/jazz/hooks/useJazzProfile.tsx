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
        workspaces: {
          $each: {
            chats: { $each: true },
            folders: {
              $each: { chats: { $each: true } },
            },
          },
        },
      },
    },
  });

  if (!me) return;

  return me.root;
};
