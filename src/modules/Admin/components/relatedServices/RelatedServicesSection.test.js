import RelatedServicesSection from './RelatedServicesSection';

jest.mock('../../../../context');
import { useRecordContext } from 'context';

import { PUBLICATION_TYPE_DATA_COLLECTION } from 'config/general';

function setup(testProps = {}, args = { isShallow: true }) {
    const props = {
        ...testProps,
    };

    return renderComponent(RelatedServicesSection, props, args);
}

describe('RelatedServicesSection', () => {
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
        const render = setup({});
        expect(render.getRenderOutput()).toMatchSnapshot();
    });

    it('should render disabled view', () => {
        const render = setup({ disabled: true });
        expect(render.getRenderOutput()).toMatchSnapshot();
    });
});
