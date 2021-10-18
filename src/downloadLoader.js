import fetch from 'isomorphic-fetch';
import jwtDecode from 'jwt-decode';
import createNotification from './createNotification';

export default async function downloadLoader(link) {
    const user = jwtDecode(localStorage.getItem('token'));
    if (user.subscriptions.length == 0) {
        createNotification('error', 'У вас нету ни одной подписки');
        return;
    }
    let result = await fetch(__UI_SERVER_ENDPOINT__ + '/loader.exe', {
        method: 'POST'
    });
    result = await result.blob();
    const url = window.URL.createObjectURL(result);
    let clickLink = false;
    if (link.download == '') clickLink = true;
    link.download = 'loader.exe';
    link.href = url;
    if (clickLink) link.click();
}
