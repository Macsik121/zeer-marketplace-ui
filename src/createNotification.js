import { NotificationManager } from 'react-notifications';

export default function createNotification(
    type,
    message,
    title
) {
    if (type == 'info') {
        NotificationManager.info(message);
    } else if (type == 'success') {
        NotificationManager.success(message, title);
    } else if (type == 'warning') {
        NotificationManager.warning(message);
    } else if (type == 'error') {
        NotificationManager.error(message);
    }
}
