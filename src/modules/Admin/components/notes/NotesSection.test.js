import NotesSection from './NotesSection';

jest.mock('../../../../context');
import { useRecordContext } from 'context';

function setup(testProps = {}, args = { isShallow: true }) {
    const props = {
        ...testProps,
    };

    return getElement(NotesSection, props, args);
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
                rek_herdc_notes: 'Test HERDC notes',
            },
        }));

        const wrapper = setup();
        expect(toJson(wrapper)).toMatchSnapshot();
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
                rek_herdc_notes: 'Test HERDC notes',
            },
        }));

        const wrapper = setup({ disabled: true });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
