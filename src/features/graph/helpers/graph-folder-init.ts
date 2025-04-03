import { JazzListOfFolders, JazzFolder } from "@/lib/jazz/schema";
import {
  IGraphData,
  IGraphNode,
  IGraphLink,
  IGraphNodeType,
} from "../Graph.interface";

export const graphFoldersInit = (folders: JazzListOfFolders): IGraphData => {
  const nodes: IGraphNode[] = [];
  const links: IGraphLink[] = [];

  function processFolders(
    folders: JazzFolder[],
    nodes: IGraphNode[],
    links: IGraphLink[],
    nested: boolean
  ) {
    folders.forEach((folder) => {
      if (!folder) return;

      if (nested) {
        nodes.push({
          id: folder.id,
          title: folder.title,
          targets: [],
          type: IGraphNodeType.FOLDER,
          nested: true,
        });
      } else {
        nodes.push({
          id: folder.id,
          title: folder.title,
          targets: [],
          type: IGraphNodeType.FOLDER,
        });
      }

      folder?.dialogs?.forEach((dialog) => {
        if (!dialog) return;

        nodes.push({
          id: dialog.id,
          username: dialog.username,
          firstName: dialog.name,
          tags: [],
          type: IGraphNodeType.DIALOG,
        });

        links.push({
          source: folder.id,
          target: dialog.id,
        });
      });

      if (folder.nestedFolders?.length) {
        processFolders(
          folder.nestedFolders as JazzFolder[],
          nodes,
          links,
          true
        );

        folder.nestedFolders.forEach((subFolder) => {
          if (!subFolder) return;
          links.push({
            source: folder.id,
            target: subFolder.id,
          });
        });
      }
    });
  }

  processFolders(folders as JazzFolder[], nodes, links, false);
  return { nodes, links };
};
