import fetch from 'isomorphic-fetch';
import fetchData from './fetchData';
import jwtDecode from 'jwt-decode';
import createNotification from './createNotification';

export default async function downloadLoader(link) {
    console.log('click happened');
    let clickLink = true;
    if (link.href != '') {
        clickLink = false;
    };
    let result;
    if (link.download == '') {
        let userHasSubs = false;
        const query = `
            query user($name: String!) {
                user(name: $name) {
                    name
                    subscriptions {
                        status {
                            isActive
                        }
                    }
                }
            }
        `;
        const username = jwtDecode(localStorage.getItem('token'));
        const vars = {
            name: username.name
        };
        const { user } = await fetchData(query, vars);
        if (user.subscriptions) {
            for(let i = 0; i < user.subscriptions.length; i++) {
                const currentSub = user.subscriptions[i];
                console.log(currentSub);
                if (currentSub.status.isActive) {
                    userHasSubs = true;
                    break;
                }
            }
        }
        if (!userHasSubs) {
            createNotification('error', 'У вас нет ни одной активной подписки');
            return;
        }
        result = await fetch(__UI_SERVER_ENDPOINT__ + '/loader.exe', {
            method: 'POST'
        });
        result = await result.blob();
        const url = window.URL.createObjectURL(result);
        link.download = 'loader.exe';
        link.href = url;
    }
    if (clickLink) {
        link.click();
    }
}
