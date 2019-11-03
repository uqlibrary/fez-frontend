import { AttachedFilesField } from './AttachedFilesField';
import { cleanup } from 'test-utils';
import { List } from 'immutable';

jest.mock('../../../../context');
import { useFormValuesContext } from 'context';

function setup(testProps = {}, args = { isShallow: true }) {
    const props = {
        input: {},
        ...testProps,
    };

    return getElement(AttachedFilesField, props, args);
}

describe('DataStreamSecuritySelector component with mockContext', () => {
    afterEach(() => cleanup);

    it('should render with form data', () => {
        useFormValuesContext.mockImplementation(() => ({
            formValues: {
                fez_datastream_info: new List([
                    {
                        dsi_dsid: 'test1.txt',
                        dsi_security_policy: 1,
                        dsi_embargo_date: '2099-01-01',
                    },
                ]),
            },
        }));

        // useRecordContext.mockImplementation(() => ({
        //     record: {
        //         rek_pid: 'UQ:123456',
        //         rek_object_type_lookup: 'Record',
        //         fez_record_search_key_ismemberof: [
        //             {
        //                 rek_ismemberof: 'Test collection',
        //                 parent: {
        //                     rek_security_policy: 2,
        //                     rek_datastream_policy: 1,
        //                 },
        //             },
        //         ],
        //     },
        // }));

        const wrapper = setup();

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
