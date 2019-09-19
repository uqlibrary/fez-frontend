import OpenAccessIcon from './OpenAccessIcon';
import { openAccessConfig } from 'config';

function setup(testProps = {}, args = { isShallow: false }) {
    const props = {
        isOpenAccess: testProps.isOpenAccess || false,
        embargoDate: testProps.embargoDate || null,
        openAccessStatusId: testProps.openAccessStatusId || 1234,
        showEmbargoText: testProps.showEmbargoText || false,
        ...testProps,
    };
    return getElement(OpenAccessIcon, props, args);
}

describe('Journal Name Component test ', () => {
    it('should render open access', () => {
        const wrapper = setup({ isOpenAccess: true });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render open access with OPEN_ACCESS_ID_LINK_NO_DOI', () => {
        const wrapper = setup({ isOpenAccess: true, openAccessStatusId: openAccessConfig.OPEN_ACCESS_ID_LINK_NO_DOI });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render embargoed', () => {
        const wrapper = setup({
            embargoDate: '2019-01-01',
            openAccessStatusId: openAccessConfig.OPEN_ACCESS_ID_LINK_NO_DOI,
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render closed access', () => {
        const wrapper = setup();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render embargoed', () => {
        const wrapper = setup({
            embargoDate: '2019-01-01',
            openAccessStatusId: openAccessConfig.OPEN_ACCESS_ID_LINK_NO_DOI,
            showEmbargoText: true,
            securityStatus: true,
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render locked', () => {
        const wrapper = setup({
            openAccessStatusId: openAccessConfig.OPEN_ACCESS_ID_LINK_NO_DOI,
            securityStatus: false,
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render no icon', () => {
        const wrapper = setup({
            isOpenAccess: null,
            openAccessStatusId: null,
            embargoDate: null,
            securityStatus: true,
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
