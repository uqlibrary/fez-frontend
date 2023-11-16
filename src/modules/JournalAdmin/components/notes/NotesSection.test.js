import React from 'react';
import NotesSection from './NotesSection';
import { rtlRender } from 'test-utils';

jest.mock('../../../../context');
import { useRecordContext } from 'context';

function setup(testProps = {}) {
    const props = {
        ...testProps,
    };

    return renderComponent(NotesSection, props);
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

        const render = setup();
        expect(render.getRenderOutput()).toMatchSnapshot();
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

        const render = setup({ disabled: true });
        expect(render.getRenderOutput()).toMatchSnapshot();
    });
});
