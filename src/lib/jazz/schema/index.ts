import { CoMap, co, Account, Profile, CoList, ID } from "jazz-tools"

// TODO: check if this is valid for jazz, maybe something is off
// here is how we see jazz working with NotLost
// user loads the mini app, we get their telegram id
// this telegram id is validated through initData verfication provided by telegram itself
// we then create jazz account for that user with that unique telegram id
// this root acccount starts with an empty contacts list and some default values
// then user can create contacts and add them to the root, more later

export class JazzListOfTags extends CoList.Of(co.string) {}
export class JazzContact extends CoMap {
  username = co.string
  firstName = co.string
  lastName = co.string
  description = co.string
  topic = co.string
  tags = co.ref(JazzListOfTags)
}
export class JazzListOfContacts extends CoList.Of(co.ref(JazzContact)) {}

export class JazzFolder extends CoMap {
  title = co.string
  dialogs = co.ref(JazzListOfDialogs)
}
export class JazzDialog extends CoMap {
  name = co.string
  username = co.string
}

export class JazzListOfDialogs extends CoList.Of(co.ref(JazzDialog)) {}
export class JazzListOfFolders extends CoList.Of(co.ref(JazzFolder)) {}

// account root is an app-specific per-user private `CoMap`
// where you can store top-level objects for that user
export class RootUserProfile extends Profile {
  telegramId = co.number // unique id for the user (how auth is done kind of)
  contacts = co.ref(JazzListOfContacts)

  username = co.string
  firstName = co.string
  lastName = co.string
  telegramSync = co.boolean // if true, app will use live tg contact to sync up

  folders = co.ref(JazzListOfFolders)
}

export class JazzAccount extends Account {
  profile = co.ref(RootUserProfile)

  /** The account migration is run on account creation and on every log-in.
   *  You can use it to set up the account root and any other initial CoValues you need.
   */
  async migrate(creationProps?: { name: string }) {
    super.migrate(creationProps)

    const profile = await RootUserProfile.load(
      this._refs.profile!.id as ID<RootUserProfile>,
      this,
      {},
    )

    if (!profile) {
      throw new Error("Account profile missing, not able to run the migration")
    }

    if (!profile._refs.contacts) {
      profile.contacts = JazzListOfContacts.create([], {
        owner: this.profile!._owner,
      })
    }

    if (!profile._refs.folders) {
      profile.folders = JazzListOfFolders.create([], {
        owner: this.profile!._owner,
      })
    }
  }
}
