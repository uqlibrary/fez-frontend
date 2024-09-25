import React from 'react';
import FileUploadRowMobileView from './FileUploadRowMobileView';
import { render, WithReduxStore } from 'test-utils';

const getProps = (testProps = {}) => ({
    index: 0,
    name: 'test.pdf',
    size: '100 MB',
    accessConditionId: null,
    embargoDate: '01/01/2017',
    requireOpenAccessStatus: true,
    disabled: false,
    classes: {
        root: 'root',
        listItem: 'listItem',
    },
    onDelete: jest.fn(),
    onEmbargoDateChange: jest.fn(),
    onAccessConditionChange: jest.fn(),
    onSecurityPolicyChange: jest.fn(),
    ...testProps,
});

function setup(testProps = {}) {
    return render(
        <WithReduxStore>
            <FileUploadRowMobileView {...getProps(testProps)} />
        </WithReduxStore>,
    );
}

describe('Component FileUploadRowMobileView', () => {
    it('should render default view', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });

    it('should render default view for admin', () => {
        const { container } = setup({ isAdmin: true });
        expect(container).toMatchSnapshot();
    });

    it('should not render embargo date picker if access condition is set to closed access', () => {
        const { container } = setup({
            accessConditionId: 1,
        });
        expect(container).toMatchSnapshot();
    });

    it('should render embargo date picker if access condition is set to open access', () => {
        const { container } = setup({
            accessConditionId: 5,
        });
        expect(container).toMatchSnapshot();
    });

    it('should not render access selector or date picker if access condition is not required to select', () => {
        const { container } = setup({
            requireOpenAccessStatus: false,
        });
        expect(container).toMatchSnapshot();
    });
});
