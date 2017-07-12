import {api} from 'config';


// TODO: loadAUthorsData - depricate - remove when cleaned up
/**
 * Fetches the the current list of authors
 * @returns {Promise}
 */
export function loadAuthorsData(querystring) {
    return new Promise((resolve, reject) => {
        api.get(`authors/search?query=${querystring}`).then(response => {
            resolve(response.data);
        }).catch(e => {
            reject(e);
            throw e;
        });
    });
}

export function fetchAuthors(query) {
    return new Promise((resolve, reject) => {
        const url = encodeURI(`authors/search?query=${query}`);
        api.get(url).then(response => {
            resolve(
                response.data.map((item) => {
                    item.displayName = item.aut_title + ' ' + item.aut_display_name +
                        (item.aut_org_username ? ' (' + item.aut_org_username + ')' : '');
                    return item;
                })
            );
        }).catch(e => {
            reject(e);
        });
    });
}
