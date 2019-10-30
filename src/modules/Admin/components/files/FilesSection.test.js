import { FilesSection } from './FilesSection';

jest.mock('../../../../context');
import { useRecordContext } from 'context';

import { PUBLICATION_TYPE_DATA_COLLECTION } from 'config/general';

function setup(testProps = {}, args = { isShallow: true }) {
    const props = {
        ...testProps,
    };

    return getElement(FilesSection, props, args);
}

describe('FilesSection component', () => {
    beforeEach(() => {
        useRecordContext.mockImplementation(() => ({
            record: {
                rek_display_type: PUBLICATION_TYPE_DATA_COLLECTION,
            },
        }));
    });

    afterEach(() => {
        useRecordContext.mockReset();
    });

    it('should render default view', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
