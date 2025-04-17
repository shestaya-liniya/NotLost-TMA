import { updateLocalStorage } from "@/helpers/useLocalStorageListener";
import {
  JazzDialog,
  JazzFolder,
  JazzListOfDialogs,
  JazzListOfTags,
  JazzTag,
  RootUserProfile,
} from "../schema";
import { TelegramDialogInfo } from "@/lib/telegram/api/telegramApiClient";

export const jazzAddDialog = (
  jazzProfile: RootUserProfile,
  dialog: TelegramDialogInfo,
  tag?: { title: string; color: string }
) => {
  if (jazzProfile.dialogs === undefined) {
    jazzProfile.dialogs = JazzListOfDialogs.create([]);
  }
  if (tag) {
    jazzProfile.dialogs?.push(
      JazzDialog.create({
        name: dialog.label,
        username: dialog.username,
        tags: JazzListOfTags.create([JazzTag.create(tag)]),
      })
    );
  } else {
    jazzProfile.dialogs?.push(
      JazzDialog.create({
        name: dialog.label,
        username: dialog.username,
        tags: JazzListOfTags.create([]),
      })
    );
  }
};

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
