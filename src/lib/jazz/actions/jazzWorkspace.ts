import { GridFlowNode } from "@/features/grid-flow/GridFlowInterface";
import {
  JazzListOfWorkspaceChats,
  JazzListOfWorkspaceFolders,
  JazzWorkspace,
  JazzWorkspaceChat,
  JazzWorkspaceFolder,
  RootUserProfile,
} from "../schema";

export const jazzCreateWorkspace = (jazzProfile: RootUserProfile) => {
  jazzProfile.workspaces!.push(
    JazzWorkspace.create({
      title: "Workspace",
      chats: JazzListOfWorkspaceChats.create([]),
      folders: JazzListOfWorkspaceFolders.create([]),
    })
  );
};

export const jazzAddChatToWorkspace = (
  workspace: JazzWorkspace,
  chatData: {
    label: string;
    username: string;
    position: {
      x: number;
      y: number;
    };
  }
) => {
  workspace.chats?.push(
    JazzWorkspaceChat.create({
      type: "chat",
      data: {
        label: chatData.label,
        username: chatData.username,
      },
      position: chatData.position,
    })
  );
};

export const jazzNodesToGridNodes = (
  jazzNodes: (JazzWorkspaceChat | JazzWorkspaceFolder | null)[]
): GridFlowNode[] => {
  const nodes = jazzNodes
    .filter((n) => n != null)
    .map((n) => {
      return {
        id: n.id,
        type: n.type,
        data: n.data,
        position: n.position,
      };
    });
  //@ts-ignore
  return nodes;
};
