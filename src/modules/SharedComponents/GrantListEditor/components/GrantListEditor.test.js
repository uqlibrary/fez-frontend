import React from 'react';
import { GrantListEditor } from './GrantListEditor';
import Immutable from 'immutable';
import { rtlRender, fireEvent, within } from 'test-utils';

function setup(testProps = {}) {
    const props = {
        disabled: false,
        meta: {},
        onChange: jest.fn(),
        locale: {},
        input: {},
        required: true,
        hideType: false,
        ...testProps,
    };
    return rtlRender(<GrantListEditor {...props} />);
}

describe('GrantListEditor', () => {
    it('should render default view', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });

    it('should render with default given value', () => {
        const { container } = setup({
            input: {
                name: 'TestField',
                value: [
                    {
                        grantAgencyName: 'Testing',
                        grantId: '1234',
                        grantAgencyType: 'Test',
                    },
                ],
            },
            locale: {
                form: {},
            },
        });
        expect(container).toMatchSnapshot();
    });

    it('should render error from props', () => {
        const { container } = setup({
            meta: {
                error: <span>Some error</span>,
            },
        });
        expect(container).toMatchSnapshot();
    });

    it('should render error from props as children', () => {
        const { container } = setup({
            meta: {
                error: (
                    <p>
                        <span>Test error 1</span>
                        <span>Test error 2</span>
                    </p>
                ),
            },
        });
        expect(container).toMatchSnapshot();
    });

    it('should render string error from props', () => {
        const { container } = setup({
            meta: {
                error: 'Test error',
            },
        });
        expect(container).toMatchSnapshot();
    });

    it('should render with default given value is Immutable List', () => {
        const { container } = setup({
            input: {
                name: 'TestField',
                value: Immutable.List([
                    {
                        grantAgencyName: 'Testing',
                        grantId: '1234',
                        grantAgencyType: 'Test',
                    },
                ]),
            },
        });
        expect(container).toMatchSnapshot();
    });

    it('should update on receiving new props', () => {
        const onChangeFn = jest.fn();
        let props = {
            input: {
                name: 'TestField',
                value: [
                    {
                        grantAgencyName: 'Testing',
                        grantId: '1234',
                        grantAgencyType: 'Test',
                    },
                ],
            },
            onChange: onChangeFn,
        };
        const { container, rerender } = setup(props);
        expect(container).toMatchSnapshot();

        props = {
            classes: {},
            input: {
                name: 'TestField',
                value: [
                    {
                        grantAgencyName: 'Test',
                        grantId: '123',
                        grantAgencyType: 'Testing',
                    },
                ],
            },
            onChange: onChangeFn,
        };

        rerender(<GrantListEditor {...props} />);

        expect(onChangeFn).toHaveBeenCalled();
    });

    it('should add grant to the list', () => {
        const { getByRole, getByLabelText, container } = setup();

        fireEvent.change(getByRole('textbox', { name: 'Funder/Sponsor name' }), { target: { value: 'Test' } });
        fireEvent.change(getByRole('textbox', { name: 'Grant ID' }), { target: { value: '123' } });
        fireEvent.mouseDown(getByLabelText('Funder/Sponsor type'));
        fireEvent.click(getByRole('option', { name: 'Government' }));
        fireEvent.click(getByRole('button', { name: 'Add grant' }));

        expect(container).toMatchSnapshot();
    });

    it('should render scroll class if grants are more than 3', () => {
        const grant1 = {
            grantAgencyName: 'Test 1',
            grantId: '123',
            grantAgencyType: 'Testing 1',
        };

        const grant2 = {
            grantAgencyName: 'Test 2',
            grantId: '456',
            grantAgencyType: 'Testing 2',
        };

        const grant3 = {
            grantAgencyName: 'Test 3',
            grantId: '456',
            grantAgencyType: 'Testing 3',
        };

        const grant4 = {
            grantAgencyName: 'Test 4',
            grantId: '456',
            grantAgencyType: 'Testing 4',
        };

        const { container } = setup({
            input: {
                name: 'test',
                value: [grant1, grant2, grant3, grant4],
            },
            classes: {
                scroll: 'scroll-class',
            },
        });
        expect(container).toMatchSnapshot();
    });

    it('should move the grant up', () => {
        const grant1 = {
            grantAgencyName: 'Test 1',
            grantId: '123',
            grantAgencyType: 'Testing 1',
        };

        const grant2 = {
            grantAgencyName: 'Test 2',
            grantId: '456',
            grantAgencyType: 'Testing 2',
        };

        const { getByTestId, container } = setup({
            input: {
                name: 'test',
                value: [grant1, grant2],
            },
        });
        expect(container).toMatchSnapshot();

        let grantList = within(getByTestId('rek-grant-list')).getAllByRole('listitem');
        expect(grantList.length).toEqual(2);
        fireEvent.click(within(grantList[1]).getByRole('button', { name: 'Move entry up the order' }));
        grantList = within(getByTestId('rek-grant-list')).getAllByRole('listitem');
        fireEvent.click(within(grantList[1]).getByRole('button', { name: 'Move entry up the order' }));

        expect(container).toMatchSnapshot();
    });

    it('should not move the grant up at index 0', () => {
        const grant1 = {
            grantAgencyName: 'Test 1',
            grantId: '123',
            grantAgencyType: 'Testing 1',
        };

        const { getByTestId, container } = setup({
            input: {
                name: 'test',
                value: [grant1],
            },
        });
        expect(container).toMatchSnapshot();

        const grantList = within(getByTestId('rek-grant-list')).getAllByRole('listitem');
        fireEvent.click(within(grantList[0]).getByRole('button', { name: 'Move entry up the order' }));

        expect(container).toMatchSnapshot();
    });

    it('should not move the grant up the disabled grant', () => {
        const grant1 = {
            grantAgencyName: 'Test 1',
            grantId: '123',
            grantAgencyType: 'Testing 1',
            disabled: true,
        };

        const grant2 = {
            grantAgencyName: 'Test 2',
            grantId: '456',
            grantAgencyType: 'Testing 2',
        };

        const { getByTestId, container } = setup({
            input: {
                name: 'test',
                value: [grant1, grant2],
            },
        });
        expect(container).toMatchSnapshot();

        const grantList = within(getByTestId('rek-grant-list')).getAllByRole('listitem');
        fireEvent.click(within(grantList[1]).getByRole('button', { name: 'Move entry up the order' }));

        expect(container).toMatchSnapshot();
    });

    it('should move the grant down', () => {
        const grant1 = {
            grantAgencyName: 'Test 1',
            grantId: '123',
            grantAgencyType: 'Testing 1',
        };

        const grant2 = {
            grantAgencyName: 'Test 2',
            grantId: '456',
            grantAgencyType: 'Testing 2',
        };

        const { getByTestId, container } = setup({
            input: {
                name: 'test',
                value: [grant1, grant2],
            },
        });
        expect(container).toMatchSnapshot();

        const grantList = within(getByTestId('rek-grant-list')).getAllByRole('listitem');
        fireEvent.click(within(grantList[0]).getByRole('button', { name: 'Move entry down the order' }));
        fireEvent.click(within(grantList[1]).getByRole('button', { name: 'Move entry down the order' }));

        expect(container).toMatchSnapshot();
    });

    it('should delete grant', () => {
        const grant1 = {
            grantAgencyName: 'Test 1',
            grantId: '123',
            grantAgencyType: 'Testing 1',
        };

        const grant2 = {
            grantAgencyName: 'Test 2',
            grantId: '456',
            grantAgencyType: 'Testing 2',
        };

        const { getByTestId, container } = setup({
            input: {
                name: 'test',
                value: [grant1, grant2],
            },
        });
        expect(container).toMatchSnapshot();

        const grantList = within(getByTestId('rek-grant-list')).getAllByRole('listitem');
        fireEvent.click(within(grantList[0]).getByRole('button', { name: 'Remove this entry' }));
        fireEvent.click(getByTestId('confirm-dialog-box'));

        expect(container).toMatchSnapshot();
    });

    it('should delete all grants', () => {
        const grant1 = {
            grantAgencyName: 'Test 1',
            grantId: '123',
            grantAgencyType: 'Testing 1',
        };

        const grant2 = {
            grantAgencyName: 'Test 2',
            grantId: '456',
            grantAgencyType: 'Testing 2',
        };

        const { getByRole, getByTestId, container } = setup({
            input: {
                name: 'test',
                value: [grant1, grant2],
            },
        });
        expect(container).toMatchSnapshot();
        fireEvent.click(getByRole('button', { name: 'Remove all entries' }));
        fireEvent.click(getByTestId('confirm-dialog-box'));
        expect(container).toMatchSnapshot();
    });

    it('should edit selected grant correctly', () => {
        const grant1 = {
            grantAgencyName: 'Test 1',
            grantId: '123',
            grantAgencyType: 'Testing 1',
        };

        const grant2 = {
            grantAgencyName: 'Test 2',
            grantId: '456',
            grantAgencyType: 'Testing 2',
        };

        const { getByTestId, getByRole } = setup({
            canEdit: true,
            input: {
                name: 'test',
                value: [grant1, grant2],
            },
        });

        let grantList = within(getByTestId('rek-grant-list')).getAllByRole('listitem');
        fireEvent.click(within(grantList[1]).getByRole('button', { name: 'Edit this entry' }));
        fireEvent.change(getByTestId('rek-grant-agency-input'), { target: { value: 'Agency 2' } });
        fireEvent.click(getByRole('button', { name: 'Edit grant' }));

        grantList = within(getByTestId('rek-grant-list')).getAllByRole('listitem');
        expect(within(grantList[1]).getByText('Agency 2')).toBeInTheDocument();
    });
});
