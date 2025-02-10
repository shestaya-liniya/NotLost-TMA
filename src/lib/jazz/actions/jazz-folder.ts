import { co } from "jazz-tools";
import {
  JazzDialog,
  JazzFolder,
  JazzListOfDialogs,
  JazzListOfFolders,
  RootUserProfile,
} from "../schema";

export const jazzCreateNewFolder = (
  jazzProfile: RootUserProfile,
  title: string
) => {
  jazzProfile.folders?.push(
    JazzFolder.create(
      {
        title,
        dialogs: JazzListOfDialogs.create([], { owner: jazzProfile._owner }),
        nestedFolders: JazzListOfFolders.create([], {
          owner: jazzProfile._owner,
        }),
      },
      { owner: jazzProfile._owner }
    )
  );
};

export const jazzDeleteFolder = (
  jazzProfile: RootUserProfile,
  folder: JazzFolder,
  nestedFolder: JazzFolder | null = null
) => {
  if (jazzProfile) {
    let filteredFolders: co<JazzFolder | null>[] | undefined;
    if (nestedFolder) {
      filteredFolders = folder.nestedFolders?.filter(
        (f) => f?.id !== nestedFolder.id
      );
    } else {
      filteredFolders = jazzProfile.folders?.filter((f) => f?.id !== folder.id);
    }

    if (filteredFolders) {
      if (nestedFolder) {
        folder.nestedFolders = JazzListOfFolders.create(filteredFolders, {
          owner: jazzProfile._owner,
        });
      } else {
        jazzProfile.folders = JazzListOfFolders.create(filteredFolders, {
          owner: jazzProfile._owner,
        });
      }
    }
  }
};

export const jazzAddDialogToFolder = (
  jazzProfile: RootUserProfile | null | undefined,
  folder: JazzFolder,
  dialog: { name: string; username: string | null }
) => {
  if (jazzProfile) {
    folder.dialogs?.push(
      JazzDialog.create(
        { name: dialog.name, username: dialog.username || "No username" },
        { owner: jazzProfile._owner }
      )
    );
  }
};

export const jazzRemoveDialogFromFolder = (
  jazzProfile: RootUserProfile,
  folder: JazzFolder,
  dialog: JazzDialog
) => {
  const filteredDialogs = folder.dialogs!.filter((d) => d?.id !== dialog.id);
  folder.dialogs! = JazzListOfDialogs.create(filteredDialogs, {
    owner: jazzProfile._owner,
  });
};

export const jazzAddNestedFolderToFolder = (
  jazzProfile: RootUserProfile,
  folder: JazzFolder,
  title: string
) => {
  if (jazzProfile) {
    folder.nestedFolders?.push(
      JazzFolder.create(
        {
          title,
          dialogs: JazzListOfDialogs.create([], { owner: jazzProfile._owner }),
          nestedFolders: JazzListOfFolders.create([], {
            owner: jazzProfile._owner,
          }),
        },
        {
          owner: jazzProfile._owner,
        }
      )
    );
  }
};
