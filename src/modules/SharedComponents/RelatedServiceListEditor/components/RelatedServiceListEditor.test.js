import React from 'react';
import RelatedServiceListEditor from './RelatedServiceListEditor';
import { render as defaultRender, fireEvent, within, WithReduxStore } from 'test-utils';
import { FormProvider } from 'react-hook-form';

const mockSetValue = jest.fn();

const services = [
    { relatedServiceId: '1111', relatedServiceDesc: 'desc 1' },
    { relatedServiceId: '2222', relatedServiceDesc: 'desc 2' },
];

function setup(testProps = {}, render = defaultRender) {
    const props = {
        disabled: false,
        state: {},
        locale: {},
        required: true,
        ...testProps,
        value: { items: testProps.value },
    };
    return render(
        <WithReduxStore>
            <FormProvider setValue={mockSetValue}>
                <RelatedServiceListEditor {...props} />
            </FormProvider>
        </WithReduxStore>,
    );
}

describe('RelatedServiceListEditor', () => {
    beforeEach(() => jest.resetAllMocks());

    it('should render with default state', () => {
        const { getByTestId, queryByTestId } = setup();
        expect(getByTestId('rek-related-service-id-input')).toBeInTheDocument();
        expect(getByTestId('rek-related-service-desc-input')).toBeInTheDocument();
        expect(queryByTestId('rek-related-service-list')).not.toBeInTheDocument();
    });

    it('should render given list', () => {
        const { getByTestId } = setup({ name: 'test', value: services });
        const list = within(getByTestId('rek-related-service-list')).getAllByRole('listitem');
        expect(list).toHaveLength(2);
    });

    it('should render error from state', () => {
        const { getByText } = setup({ state: { error: 'Test error' } });
        expect(getByText('Test error')).toBeInTheDocument();
    });

    it('should add a related service to an empty list', () => {
        const { getByTestId, getByRole } = setup({ name: 'test' });

        fireEvent.change(getByRole('combobox', { name: 'Related Service ID' }), { target: { value: '123' } });
        fireEvent.change(getByTestId('rek-related-service-desc-input'), { target: { value: 'desc' } });
        fireEvent.click(getByRole('button', { name: 'Add related service' }));

        const list = within(getByTestId('rek-related-service-list')).getAllByRole('listitem');
        expect(list).toHaveLength(1);
        expect(mockSetValue).toHaveBeenCalledWith(
            'test',
            { items: [{ relatedServiceId: '123', relatedServiceDesc: 'desc' }] },
            {
                shouldValidate: true,
            },
        );
    });

    it('should add a related service to an empty list', () => {
        const { getByTestId, getByRole } = setup({ name: 'test', value: services });

        fireEvent.change(getByRole('combobox', { name: 'Related Service ID' }), { target: { value: '123' } });
        fireEvent.change(getByTestId('rek-related-service-desc-input'), { target: { value: 'desc' } });
        fireEvent.click(getByRole('button', { name: 'Add related service' }));

        const list = within(getByTestId('rek-related-service-list')).getAllByRole('listitem');
        expect(list).toHaveLength(3);
        expect(mockSetValue).toHaveBeenCalledWith(
            'test',
            { items: [...services, { relatedServiceId: '123', relatedServiceDesc: 'desc' }] },
            {
                shouldValidate: true,
            },
        );
    });

    it('should edit a selected service and update the list', () => {
        const { getByTestId, getByRole } = setup({ canEdit: true, name: 'test', value: services });

        let list = within(getByTestId('rek-related-service-list')).getAllByRole('listitem');
        fireEvent.click(within(list[1]).getByRole('button', { name: 'Edit this entry' }));
        fireEvent.change(getByTestId('rek-related-service-desc-input'), { target: { value: 'updated desc' } });
        fireEvent.click(getByRole('button', { name: 'Edit related service' }));

        list = within(getByTestId('rek-related-service-list')).getAllByRole('listitem');
        expect(within(list[1]).getByText('updated desc')).toBeInTheDocument();
    });

    it('should move a service up and down', () => {
        const { getByTestId } = setup({ name: 'test', value: services });

        let list = within(getByTestId('rek-related-service-list')).getAllByRole('listitem');
        expect(within(list[0]).getByText('1111')).toBeInTheDocument();

        fireEvent.click(within(list[1]).getByRole('button', { name: 'Move entry up the order' }));
        list = within(getByTestId('rek-related-service-list')).getAllByRole('listitem');
        expect(within(list[0]).getByText('2222')).toBeInTheDocument();

        fireEvent.click(within(list[0]).getByRole('button', { name: 'Move entry down the order' }));
        list = within(getByTestId('rek-related-service-list')).getAllByRole('listitem');
        expect(within(list[0]).getByText('1111')).toBeInTheDocument();
    });

    it('should not move up when previous entry is disabled', () => {
        const services = [
            { relatedServiceId: '1111', relatedServiceDesc: 'desc 1', disabled: true },
            { relatedServiceId: '2222', relatedServiceDesc: 'desc 2' },
        ];
        const { getByTestId } = setup({ name: 'test', value: services });

        const list = within(getByTestId('rek-related-service-list')).getAllByRole('listitem');
        fireEvent.click(within(list[1]).getByRole('button', { name: 'Move entry up the order' }));

        const updatedList = within(getByTestId('rek-related-service-list')).getAllByRole('listitem');
        expect(within(updatedList[0]).getByText('1111')).toBeInTheDocument();
        expect(within(updatedList[1]).getByText('2222')).toBeInTheDocument();
    });

    it('should delete a service', () => {
        const { getByTestId, queryByText } = setup({ name: 'test', value: services });

        const list = within(getByTestId('rek-related-service-list')).getAllByRole('listitem');
        fireEvent.click(within(list[0]).getByRole('button', { name: 'Remove this entry' }));
        fireEvent.click(getByTestId('confirm-dialog-box'));

        expect(queryByText('desc 1')).not.toBeInTheDocument();
        expect(queryByText('desc 2')).toBeInTheDocument();
    });

    it('should delete all services', () => {
        const { getByTestId, getByRole, queryByTestId } = setup({ name: 'test', value: services });

        fireEvent.click(getByRole('button', { name: 'Remove all entries' }));
        fireEvent.click(getByTestId('confirm-dialog-box'));

        expect(queryByTestId('rek-related-service-list')).not.toBeInTheDocument();
        expect(mockSetValue).toHaveBeenCalledWith('test', { items: [] }, { shouldValidate: true });
    });

    it('should apply scroll style when more than 3 services', () => {
        const { getByTestId } = setup({
            name: 'test',
            value: [
                { relatedServiceId: '1111', relatedServiceDesc: 'desc' },
                { relatedServiceId: '2222', relatedServiceDesc: 'desc' },
                { relatedServiceId: '3333', relatedServiceDesc: 'desc' },
                { relatedServiceId: '4444', relatedServiceDesc: 'desc' },
            ],
        });
        expect(getByTestId('rek-related-service-list')).toHaveStyle({ overflowY: 'scroll' });
    });
});
