export default function navigateToUrl(uri, target, navigatedFrom, options) {
    let fullUri = uri;
    if (navigatedFrom) {
        const queryStringGlue = uri.indexOf('?') > -1 ? '&' : '?';
        fullUri = `${uri}${queryStringGlue}navigatedFrom=${encodeURIComponent(navigatedFrom)}`;
    }
    window.open(fullUri, target, options);
}
