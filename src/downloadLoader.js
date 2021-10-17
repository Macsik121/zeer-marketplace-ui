import fetch from 'isomorphic-fetch';

export default async function downloadLoader(link) {
    let result = await fetch(
        __UI_SERVER_ENDPOINT__ + '/loader.exe'
    );
    result = await result.blob();
    const url = window.URL.createObjectURL(result);
    let clickLink = false;
    if (link.download == '') clickLink = true;
    link.download = 'loader.exe';
    link.href = url;
    if (clickLink) link.click();
}