import React from 'react';
import RelatedServiceListEditor from './RelatedServiceListEditor';
import { render, fireEvent, within, WithReduxStore } from 'test-utils';
import { FormProvider } from 'react-hook-form';

const mockSetValue = jest.fn();
function setup(testProps = {}, renderer = render) {
    const props = {
        disabled: false,
        state: {},
        locale: {},
        required: true,
        hideType: false,
        ...testProps,
    };
    return renderer(
        <WithReduxStore>
            <FormProvider setValue={mockSetValue}>
                <RelatedServiceListEditor {...props} />
            </FormProvider>
        </WithReduxStore>,
    );
}

describe('RelatedServiceListEditor', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('should render default view', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });

    it('should render with default given value', () => {
        const { container } = setup({
            name: 'TestField',
            value: [
                {
                    relatedServiceId: '1234',
                    relatedServiceDesc: 'desc',
                },
            ],
            locale: {
                form: {},
            },
        });
        expect(container).toMatchSnapshot();
    });

    it('should render error from props', () => {
        const { container } = setup({
            state: {
                error: <span>Some error</span>,
            },
        });
        expect(container).toMatchSnapshot();
    });

    it('should render error from props as children', () => {
        const { container } = setup({
            state: {
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
            state: {
                error: 'Test error',
            },
        });
        expect(container).toMatchSnapshot();
    });

    it('should update on receiving new props', () => {
        const value = {
            relatedServiceId: '1234',
            relatedServiceDesc: 'desc',
        };
        const props = {
            name: 'TestField',
            value: [value],
        };
        const { container /* , rerender */ } = setup(props);
        expect(container).toMatchSnapshot();

        //     props = {
        //         classes: {},

        //         name: 'TestField',
        //         value: [
        //             {
        //                 relatedServiceId: '4567',
        //                 relatedServiceDesc: 'desc',
        //             },
        //         ],
        //     };

        //     setup(props, rerender);

        //     expect(mockSetValue).toHaveBeenCalledWith('TestField', [], { shouldValidate: true });
        //     expect(mockSetValue).toHaveBeenCalledWith('TestField', [value], { shouldValidate: true });
    });

    it('should add related service to the list', () => {
        const { getByRole, container } = setup();

        fireEvent.change(getByRole('combobox', { name: 'Related Service ID' }), { target: { value: '123' } });
        fireEvent.change(getByRole('textbox', { name: 'Related Service Description' }), { target: { value: 'desc' } });
        fireEvent.click(getByRole('button', { name: 'Add related service' }));

        expect(container).toMatchSnapshot();
    });

    it('should render scroll class if grants are more than 3', () => {
        const service1 = {
            relatedServiceId: '1111',
            relatedServiceDesc: 'desc',
        };

        const service2 = {
            relatedServiceId: '2222',
            relatedServiceDesc: 'desc',
        };

        const service3 = {
            relatedServiceId: '3333',
            relatedServiceDesc: 'desc',
        };

        const service4 = {
            relatedServiceId: '4444',
            relatedServiceDesc: 'desc',
        };

        const { container } = setup({
            name: 'test',
            value: [service1, service2, service3, service4],
            classes: {
                scroll: 'scroll-class',
            },
        });
        expect(container).toMatchSnapshot();
    });

    it('should move the grant up', () => {
        const service1 = {
            relatedServiceId: '1111',
            relatedServiceDesc: 'desc',
        };

        const service2 = {
            relatedServiceId: '2222',
            relatedServiceDesc: 'desc',
        };

        const { getByTestId, container } = setup({
            name: 'test',
            value: [service1, service2],
        });
        expect(container).toMatchSnapshot();

        let serviceList = within(getByTestId('rek-related-service-list')).getAllByRole('listitem');
        expect(serviceList.length).toEqual(2);
        fireEvent.click(within(serviceList[1]).getByRole('button', { name: 'Move entry up the order' }));
        serviceList = within(getByTestId('rek-related-service-list')).getAllByRole('listitem');
        fireEvent.click(within(serviceList[1]).getByRole('button', { name: 'Move entry up the order' }));

        expect(container).toMatchSnapshot();
    });

    it('should not move the grant up at index 0', () => {
        const service1 = {
            relatedServiceId: '1111',
            relatedServiceDesc: 'desc',
        };

        const { getByTestId, container } = setup({
            name: 'test',
            value: [service1],
        });
        expect(container).toMatchSnapshot();

        const serviceList = within(getByTestId('rek-related-service-list')).getAllByRole('listitem');
        fireEvent.click(within(serviceList[0]).getByRole('button', { name: 'Move entry up the order' }));

        expect(container).toMatchSnapshot();
    });

    it('should not move the service up the disabled grant', () => {
        const service1 = {
            relatedServiceId: '1111',
            relatedServiceDesc: 'desc',
            disabled: true,
        };

        const service2 = {
            relatedServiceId: '2222',
            relatedServiceDesc: 'desc',
        };

        const { getByTestId, container } = setup({
            name: 'test',
            value: [service1, service2],
        });
        expect(container).toMatchSnapshot();

        const serviceList = within(getByTestId('rek-related-service-list')).getAllByRole('listitem');
        fireEvent.click(within(serviceList[1]).getByRole('button', { name: 'Move entry up the order' }));

        expect(container).toMatchSnapshot();
    });

    it('should move the service down', () => {
        const service1 = {
            relatedServiceId: '1111',
            relatedServiceDesc: 'desc',
        };

        const service2 = {
            relatedServiceId: '2222',
            relatedServiceDesc: 'desc',
        };

        const { getByTestId, container } = setup({
            name: 'test',
            value: [service1, service2],
        });
        expect(container).toMatchSnapshot();

        const serviceList = within(getByTestId('rek-related-service-list')).getAllByRole('listitem');
        fireEvent.click(within(serviceList[0]).getByRole('button', { name: 'Move entry down the order' }));
        fireEvent.click(within(serviceList[1]).getByRole('button', { name: 'Move entry down the order' }));

        expect(container).toMatchSnapshot();
    });

    it('should delete grant', () => {
        const service1 = {
            relatedServiceId: '1111',
            relatedServiceDesc: 'desc',
        };

        const service2 = {
            relatedServiceId: '2222',
            relatedServiceDesc: 'desc',
        };

        const { getByTestId, container } = setup({
            name: 'test',
            value: [service1, service2],
        });
        expect(container).toMatchSnapshot();

        const serviceList = within(getByTestId('rek-related-service-list')).getAllByRole('listitem');
        fireEvent.click(within(serviceList[0]).getByRole('button', { name: 'Remove this entry' }));
        fireEvent.click(getByTestId('confirm-dialog-box'));

        expect(container).toMatchSnapshot();
    });

    it('should delete all services', () => {
        const service1 = {
            relatedServiceId: '1111',
            relatedServiceDesc: 'desc',
        };

        const service2 = {
            relatedServiceId: '2222',
            relatedServiceDesc: 'desc',
        };

        const { getByRole, getByTestId, container } = setup({
            name: 'test',
            value: [service1, service2],
        });
        expect(container).toMatchSnapshot();
        fireEvent.click(getByRole('button', { name: 'Remove all entries' }));
        fireEvent.click(getByTestId('confirm-dialog-box'));
        expect(container).toMatchSnapshot();
    });

    it('should edit selected service correctly', () => {
        const service1 = {
            relatedServiceId: '1111',
            relatedServiceDesc: 'desc',
        };

        const service2 = {
            relatedServiceId: '2222',
            relatedServiceDesc: 'desc',
        };

        const { getByTestId, getByRole } = setup({
            canEdit: true,
            name: 'test',
            value: [service1, service2],
        });

        let serviceList = within(getByTestId('rek-related-service-list')).getAllByRole('listitem');
        fireEvent.click(within(serviceList[1]).getByRole('button', { name: 'Edit this entry' }));
        fireEvent.change(getByTestId('rek-related-service-desc-input'), { target: { value: 'updated desc' } });
        fireEvent.click(getByRole('button', { name: 'Edit related service' }));

        serviceList = within(getByTestId('rek-related-service-list')).getAllByRole('listitem');
        expect(within(serviceList[1]).getByText('updated desc')).toBeInTheDocument();
    });

    it('should call setValue on state change', () => {
        const mockOnChange = jest.fn();
        const mockSetValue = jest.fn();
        jest.spyOn(require('react-hook-form'), 'useFormContext').mockReturnValue({ setValue: mockSetValue });

        const inputName = 'my-input';
        const { getByRole } = setup({
            onChange: mockOnChange,
            name: inputName,
        });

        fireEvent.change(getByRole('combobox', { name: 'Related Service ID' }), { target: { value: 'Test{enter}' } });
        expect(mockOnChange).not.toHaveBeenCalledWith(true);
        expect(mockOnChange).not.toHaveBeenCalledWith([]);
        expect(mockSetValue).toHaveBeenCalledWith(inputName, true, { shouldValidate: true });
        // expect(mockSetValue).toHaveBeenCalledWith(inputName, [], { shouldValidate: true });
    });
});
