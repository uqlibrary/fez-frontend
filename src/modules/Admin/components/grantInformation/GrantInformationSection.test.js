import GrantInformationSection from './GrantInformationSection';

jest.mock('../../../../context');
import { useRecordContext } from 'context';

import { PUBLICATION_TYPE_JOURNAL_ARTICLE } from 'config/general';

function setup(testProps = {}, args = { isShallow: true }) {
    const props = {
        ...testProps,
    };

    return getElement(GrantInformationSection, props, args);
}

describe('GrantInformationSection', () => {
    beforeEach(() => {
        useRecordContext.mockImplementation(() => ({
            record: {
                rek_display_type: PUBLICATION_TYPE_JOURNAL_ARTICLE,
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

    it('should render disabled view', () => {
        const wrapper = setup({ disabled: true });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
