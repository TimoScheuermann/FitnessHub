import { Location } from 'vue-router';
import { FHEventBus } from './FHEventbus';
import { IFHNotification } from './interfaces';
import { UserManagement } from './UserManagement';

export class NotificationManagement {
  public static getUnreadMessages(): number {
    if (!UserManagement.getUserID()) return 0;

    const messages = UserManagement.getMessages();
    if (!messages) return 0;
    return messages.filter(x => !x.read && x.to === UserManagement.getUserID())
      .length;
  }

  public static getTotalNotifications(): number {
    return this.getUnreadMessages();
  }

  public static sendNotification(
    title: string,
    text: string,
    route?: Location,
    img?: string
  ): void {
    FHEventBus.$emit('fh-notification', {
      title: title,
      text: text,
      img: img,
      route: route
    } as IFHNotification);
  }
}
