import React from 'react';
import AdminViewRecordDrawerContent from './AdminViewRecordDrawerContent';
import { render, fireEvent } from 'test-utils';

const setup = (testProps = {}, renderer = render) => {
    const props = {
        title: 'test title',
        content: { sections: [[{ type: 'header', value: 'test header' }]] },
        ...testProps,
    };

    return renderer(<AdminViewRecordDrawerContent {...props} />);
};

describe('AdminViewRecordDrawerContent', () => {
    it('should render', () => {
        const { getByText } = setup();
        expect(getByText('test title')).toBeInTheDocument();
        expect(getByText('test header')).toBeInTheDocument();
    });
    it('should handle clicks', () => {
        const handleDrawerToggleFn = jest.fn();
        const writeTextFn = jest.fn();
        const { getByText, getByTestId } = setup({
            content: {
                sections: [
                    [
                        { type: 'header', value: 'test header', clipboard: true },
                        { type: 'content', value: 'test content', clipboard: true },
                    ],
                ],
            },
            actions: { handleDrawerToggle: handleDrawerToggleFn, writeText: writeTextFn },
        });
        expect(getByText('test title')).toBeInTheDocument();
        fireEvent.click(getByTestId('btnAdminRecordDrawerCloseBtnDesktop'));
        expect(handleDrawerToggleFn).toHaveBeenCalled();
        fireEvent.click(getByTestId('drawer-Desktop-clipboard-button-0-1'));
        expect(writeTextFn).toHaveBeenCalled();
    });
});
