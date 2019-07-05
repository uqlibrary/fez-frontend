import OpenAccessIcon from './OpenAccessIcon';
import { openAccessConfig } from 'config';

function setup(testProps, isShallow = false) {
    const props = {
        isOpenAccess: false,
        embargoDate: null,
        openAccessStatusId: 1234,
        showEmbargoText: false,
        ...testProps,
    };
    return getElement(OpenAccessIcon, props, isShallow);
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
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render embargoed', () => {
        const wrapper = setup({
            embargoDate: '2019-01-01',
            openAccessStatusId: openAccessConfig.OPEN_ACCESS_ID_LINK_NO_DOI,
            showEmbargoText: true,
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
