import React from 'react';
import OpenAccessIcon from './OpenAccessIcon';
import { openAccessConfig } from 'config';
import { rtlRender } from 'test-utils';

function setup(testProps = {}) {
    const props = {
        isOpenAccess: testProps.isOpenAccess || false,
        embargoDate: testProps.embargoDate || null,
        openAccessStatusId: testProps.openAccessStatusId || 1234,
        showEmbargoText: testProps.showEmbargoText || false,
        ...testProps,
    };
    return rtlRender(<OpenAccessIcon {...props} />);
}

describe('Journal Name Component test ', () => {
    it('should render open access', () => {
        const { container } = setup({ isOpenAccess: true });
        expect(container).toMatchSnapshot();
    });

    it('should pass style to child component', () => {
        const { container } = setup({ isOpenAccess: true, style: { spacingBottom: -10, border: '10px solid purple' } });
        expect(container).toMatchSnapshot();
    });

    it('should render open access with OPEN_ACCESS_ID_LINK_NO_DOI', () => {
        const { container } = setup({
            isOpenAccess: true,
            openAccessStatusId: openAccessConfig.OPEN_ACCESS_ID_LINK_NO_DOI,
        });
        expect(container).toMatchSnapshot();
    });

    it('should render embargoed', () => {
        const { container } = setup({
            embargoDate: '2019-01-01',
            openAccessStatusId: openAccessConfig.OPEN_ACCESS_ID_LINK_NO_DOI,
        });
        expect(container).toMatchSnapshot();
    });

    it('should render closed access', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });

    it('should render embargoed', () => {
        const { container } = setup({
            embargoDate: '2019-01-01',
            openAccessStatusId: openAccessConfig.OPEN_ACCESS_ID_LINK_NO_DOI,
            showEmbargoText: true,
            securityStatus: true,
        });
        expect(container).toMatchSnapshot();
    });

    it('should render locked', () => {
        const { container } = setup({
            openAccessStatusId: openAccessConfig.OPEN_ACCESS_ID_LINK_NO_DOI,
            securityStatus: false,
        });
        expect(container).toMatchSnapshot();
    });

    it('should render no icon', () => {
        const { container } = setup({
            isOpenAccess: null,
            openAccessStatusId: null,
            embargoDate: null,
            securityStatus: true,
        });
        expect(container).toMatchSnapshot();
    });
});
