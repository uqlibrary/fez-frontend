import {APP_URL} from 'config';

export default {
    issues: {
        fixRecord: ({pid = '', userName = '', userId = '', title = '', comments = '', link = '', files = ''}) =>
            `Record: ${APP_URL}view/${pid}\n` +
            `User: ${userName} (${userId}) has indicated that they require a fix to this publication.\n` +
            `${title && ('Title of publication:' + title + '\n')}` +
            `${comments && ('Added comments: ' + comments + '\n')}` +
            `${link && ('Added link: ' + link + '\n') || ''}` +
            `${files && ('Added files: ' + files) || ''}`
    }
};
