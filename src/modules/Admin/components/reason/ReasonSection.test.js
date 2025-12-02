import React from 'react';
import { rtlRender, FormProviderWrapper, assertDisabled, assertEnabled } from 'test-utils';
import ReasonSection from './ReasonSection';

jest.mock('../../../../context');
import { useRecordContext } from 'context';

function setup(testProps = {}, renderer = rtlRender) {
    const props = {
        ...testProps,
    };
    return renderer(
        <FormProviderWrapper values={{}}>
            <ReasonSection {...props} />
        </FormProviderWrapper>,
    );
}

describe('ReasonSection component', () => {
    it('should render default view', () => {
        useRecordContext.mockImplementation(() => ({
            record: {
                rek_pid: 'UQ:123456',
                rek_object_type_lookup: 'Community',
                rek_display_type: 11,
                fez_record_search_key_notes: {
                    rek_notes: 'Test notes',
                },
                fez_internal_notes: {
                    ain_detail: 'Test internal notes',
                },
            },
        }));

        const { container, getByTestId } = setup({});
        assertEnabled(getByTestId('reason-input'));
        expect(container).toMatchSnapshot();
    });

    it('should render disabled view', () => {
        useRecordContext.mockImplementation(() => ({
            record: {
                rek_pid: 'UQ:123456',
                rek_object_type_lookup: 'Collection',
                rek_display_type: 9,
                fez_record_search_key_notes: {
                    rek_notes: 'Test notes',
                },
                fez_internal_notes: {
                    ain_detail: 'Test internal notes',
                },
            },
        }));

        const { container, getByTestId } = setup({ disabled: true });
        assertDisabled(getByTestId('reason-input'));
        expect(container).toMatchSnapshot();
    });
});
