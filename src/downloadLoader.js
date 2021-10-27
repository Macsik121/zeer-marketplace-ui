import fetch from 'isomorphic-fetch';
import fetchData from './fetchData';
import jwtDecode from 'jwt-decode';
import createNotification from './createNotification';

export default async function downloadLoader(link) {
    console.log('getting loader.exe')
    let result = await fetch(__UI_SERVER_ENDPOINT__ + '/loader.exe', {
        method: 'POST'
    });
    result = await result.blob();
    console.log('loader.exe is gotten');
    const url = window.URL.createObjectURL(result);
    let clickLink = false;
    let userHasActiveSubs = false;
    if (link.download == '') {
        clickLink = true;
    } else {
        console.log('checking user for subscriptions')
        let username = jwtDecode(localStorage.getItem('token'));
        username = username.name;
        const { user } = await fetchData(`
            query user($name: String!) {
                user(name: $name) {
                    subscriptions {
                        status {
                            isActive
                        }
                    }
                }
            }
        `, { name: username });
        for(let i = 0; i < user.subscriptions.length; i++) {
            if (user.subscriptions[i].status.isActive) {
                userHasActiveSubs = true;
                break;
            }
        }
        console.log('subs are checked')
    }
    console.log(userHasActiveSubs);
    if (!userHasActiveSubs) {
        createNotification('error', 'У вас нету ни одной активной подписки');
        return;
    };
    link.download = 'loader.exe';
    link.href = url;
    if (clickLink) link.click();
}
