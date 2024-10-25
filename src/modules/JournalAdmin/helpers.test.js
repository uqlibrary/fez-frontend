import { getInitialFormValues } from './helpers';

import { journalDoaj } from 'mock/data';
import { ADMIN_JOURNAL } from 'config/general';
import { adminJournalFields } from 'config/journalAdmin/fields';
import { helpersTypicalExpected } from 'mock/data/testing/journalAdmin';
import { helpersNonTypicalExpected } from 'mock/data/testing/journalAdmin';

describe('Helpers', () => {
    describe('getInitialFormValues', () => {
        it('expected typical output', () => {
            expect(getInitialFormValues(journalDoaj.data)).toEqual(helpersTypicalExpected);
        });
        it('expected non-typical output', () => {
            const fields = adminJournalFields;
            delete fields.uqData;
            delete fields.doaj;
            delete fields.indexed;

            const config = { [ADMIN_JOURNAL]: fields };
            expect(getInitialFormValues(journalDoaj.data, config)).toEqual(helpersNonTypicalExpected);
        });
    });
});
