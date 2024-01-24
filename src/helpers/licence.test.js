import { default as fileDataRecord } from 'mock/data/testing/fileData';
import { CURRENT_LICENCES } from 'config/general';

import { getDownloadLicence } from './licence';

it('getDownloadLicence()', () => {
    const publicationWithRestrictiveLicense = {
        ...fileDataRecord,
        fez_record_search_key_license: { rek_license: CURRENT_LICENCES[0].value },
    };
    expect(getDownloadLicence(fileDataRecord)).toBe(undefined);
    expect(getDownloadLicence(publicationWithRestrictiveLicense)).toEqual(CURRENT_LICENCES[0]);
});
