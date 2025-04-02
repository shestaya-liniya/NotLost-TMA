import {
  IGraphNode,
  IGraphNodeDialog,
  IGraphNodeType,
} from "../Graph.interface";

export default function graphSelectDialog(
  node: IGraphNode,
  selectedDialog: IGraphNodeDialog | null,
  setSelectedDialog: (node: IGraphNodeDialog | null) => void
) {
  if (node.type === IGraphNodeType.DIALOG && node !== selectedDialog) {
    if (selectedDialog) {
      setSelectedDialog(null);
      setTimeout(() => {
        setSelectedDialog(node as IGraphNodeDialog);
      }, 150);
    } else {
      setSelectedDialog(node as IGraphNodeDialog);
    }
  }
}
