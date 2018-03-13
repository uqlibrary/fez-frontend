import {APP_URL} from 'config';

export default {
    issues: {
        fixRecord: ({pid = '', userName = '', userId = '', comments = ''}) =>
            'Record: ' + APP_URL + `view/${pid} \n User '${userName} (${userId})' has indicated that they require a fix to this publication: ${comments}`,
        newRecord: ({pid = '', userName = '', userId = '', comments = ''}) =>
            'Record: ' + APP_URL + `view/${pid} \n User '${userName} (${userId})' has added some comments to this publication: ${comments}`,
    }
};
