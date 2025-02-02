import { injectable } from "inversify";

const NOTIFICATION_ID_UPDATE = "vimmatic-update";

export default interface Notifier {
  notifyUpdated(version: string, onclick: () => void): Promise<void>;
}

@injectable()
export class NotifierImpl implements NotifierImpl {
  async notifyUpdated(version: string, onclick: () => void): Promise<void> {
    const title = `Vimmatic ${version} has been installed`;
    const message = "Click here to see release notes";

    const listener = (id: string) => {
      if (id !== NOTIFICATION_ID_UPDATE) {
        return;
      }
      onclick();
      chrome.notifications.onClicked.removeListener(listener);
    };
    chrome.notifications.onClicked.addListener(listener);

    chrome.notifications.create(NOTIFICATION_ID_UPDATE, {
      type: "basic",
      iconUrl: chrome.runtime.getURL("resources/icon_48x48.png"),
      title,
      message,
    });
  }
}
