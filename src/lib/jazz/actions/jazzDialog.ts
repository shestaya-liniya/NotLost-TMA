import { updateLocalStorage } from "@/helpers/useLocalStorageListener";
import {
  JazzDialog,
  JazzFolder,
  JazzListOfDialogs,
  JazzListOfTags,
  JazzTag,
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

export const jazzAddTag = (
  jazzProfile: RootUserProfile,
  dialog: JazzDialog,
  tag: { title: string; color: string }
) => {
  dialog.tags!.push(
    JazzTag.create(
      {
        title: tag.title,
        color: tag.color,
      },
      {
        owner: jazzProfile._owner,
      }
    )
  );

  updateLocalStorage("folders", JSON.stringify(jazzProfile.folders));
};

export const jazzRemoveTagFromDialog = (
  jazzProfile: RootUserProfile,
  dialog: JazzDialog,
  tag: JazzTag
) => {
  const filteredTags = dialog.tags!.filter((t) => t?.id !== tag.id);
  dialog.tags! = JazzListOfTags.create(filteredTags, {
    owner: jazzProfile._owner,
  });
  updateLocalStorage("folders", JSON.stringify(jazzProfile.folders));
};
