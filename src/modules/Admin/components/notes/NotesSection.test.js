import React from 'react';
import { rtlRender, WithReduxStore, FormProviderWrapper } from 'test-utils';
import NotesSection from './NotesSection';

jest.mock('../../../../context');
import { useRecordContext } from 'context';

function setup(testProps = {}) {
    const props = {
        ...testProps,
    };

    return rtlRender(
        <WithReduxStore>
            <FormProviderWrapper>
                <NotesSection {...props} />
            </FormProviderWrapper>
        </WithReduxStore>,
    );
}

describe('NotesSection component', () => {
    it('should render default view', () => {
        useRecordContext.mockImplementation(() => ({
            record: {
                rek_pid: 'UQ:123456',
                rek_object_type_lookup: 'Record',
                rek_display_type: 179,
                fez_record_search_key_notes: {
                    rek_notes: 'Test notes',
                },
                fez_internal_notes: {
                    ain_detail: 'Test internal notes',
                },
            },
        }));

        const { container } = setup();
        expect(container).toMatchSnapshot();
    });

    it('should render disabled view', () => {
        useRecordContext.mockImplementation(() => ({
            record: {
                rek_pid: 'UQ:123456',
                rek_object_type_lookup: 'Record',
                rek_display_type: 179,
                fez_record_search_key_notes: {
                    rek_notes: 'Test notes',
                },
                fez_internal_notes: {
                    ain_detail: 'Test internal notes',
                },
            },
        }));

        const { container } = setup({ disabled: true });
        expect(container).toMatchSnapshot();
    });
});
