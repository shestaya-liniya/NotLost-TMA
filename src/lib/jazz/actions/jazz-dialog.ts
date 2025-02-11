import { updateLocalStorage } from "@/helpers/use-localstorage-listener";
import {
  JazzDialog,
  JazzFolder,
  JazzListOfDialogs,
  RootUserProfile,
} from "../schema";

export const jazzRemoveDialog = (
  jazzProfile: RootUserProfile,
  dialog: JazzDialog,
  folder: JazzFolder
) => {
  const filteredDialogs = folder.dialogs!.filter((d) => d?.id !== dialog.id);
  folder.dialogs! = JazzListOfDialogs.create(filteredDialogs, {
    owner: jazzProfile._owner,
  });
  updateLocalStorage("folders", JSON.stringify(jazzProfile.folders));
};
