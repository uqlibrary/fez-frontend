import FieldGridItem from './FieldGridItem';

jest.mock('../../../../context');
import { useFormValuesContext, useRecordContext } from 'context';

global.console = {
    warn: jest.fn(),
};

const setup = (testProps = {}, args = { isShallow: true }) => {
    const props = {
        ...testProps,
        group: [1],
    };

    return getElement(FieldGridItem, props, args);
};

describe('FieldGridItem', () => {
    beforeEach(() => {
        useFormValuesContext.mockImplementation(() => ({
            formValues: {
                rek_title: 'Test title',
            },
        }));
        useRecordContext.mockImplementation(() => ({
            record: {
                rek_pid: 'UQ:123456',
                rek_title: 'This is test record',
                // rek_object_type_lookup: 'Record',
                // rek_display_type_lookup: 'Journal Article',
            },
        }));
    });

    afterEach(() => {
        useFormValuesContext.mockReset();
        useRecordContext.mockReset();
    });

    it('should render default view', () => {
        const wrapper = setup({
            field: 'rek_title',
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should handle missing field config', () => {
        setup({
            field: 'fake_field',
        });
        expect(global.console.warn).toHaveBeenCalledWith('No field config found for', 'fake_field');
    });
});

describe('FieldGridItem without record', () => {
    beforeEach(() => {
        useRecordContext.mockImplementation(() => ({
            record: {},
        }));
    });

    it('should render default view', () => {
        const wrapper = setup({
            field: 'rek_title',
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
