import React from 'react';
import TitleOrPidOptionTemplate from './TitleOrPidOptionTemplate';
import { rtlRender, withRouter, withRedux } from 'test-utils';

function setup(testProps = {}) {
    const props = {
        ...testProps,
    };

    return rtlRender(withRouter()(withRedux()(<TitleOrPidOptionTemplate {...props} />)));
}
describe('TitleOrPidOptionTemplate component', () => {
    it('should render FoR option correctly', () => {
        const mockRecord = {
            rek_pid: 'UQ:123456',
            rek_title: 'This is a title',
            rek_description: 'This is a description.',
        };

        const { getByText } = setup({
            option: mockRecord,
        });

        expect(getByText('This is a title')).toBeInTheDocument();
        expect(getByText('UQ:123456')).toBeInTheDocument();
    });
});
