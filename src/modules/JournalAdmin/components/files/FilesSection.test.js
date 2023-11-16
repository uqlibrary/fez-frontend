import { FilesSection } from './FilesSection';
import { PUBLICATION_TYPE_DATA_COLLECTION, PUBLICATION_TYPE_AUDIO_DOCUMENT } from 'config/general';

jest.mock('../../../../context');
import { useRecordContext } from 'context';

function setup(testProps = {}, args = { isShallow: true }) {
    const props = {
        ...testProps,
    };

    return renderComponent(FilesSection, props, args);
}

describe('FilesSection component', () => {
    afterEach(() => {
        useRecordContext.mockReset();
    });

    it('should render default view for Files on a publication type that DOES show advisory statement', () => {
        useRecordContext.mockImplementation(() => ({
            record: {
                rek_display_type: PUBLICATION_TYPE_AUDIO_DOCUMENT,
            },
        }));

        const render = setup({});
        expect(render.getRenderOutput()).toMatchSnapshot();
    });

    it('should render default view for Files on a Data Collection publication type', () => {
        useRecordContext.mockImplementation(() => ({
            record: {
                rek_display_type: PUBLICATION_TYPE_DATA_COLLECTION,
            },
        }));

        const render = setup({});
        expect(render.getRenderOutput()).toMatchSnapshot();
    });
});
