import { AttachedFilesField } from './AttachedFilesField';
import { cleanup } from 'test-utils';

jest.mock('../../../../context');
import { useFormValuesContext } from 'context';

// import { recordWithDatastreams } from 'mock/data';

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
                fez_datastream_info: [
                    {
                        dsi_dsid: 'test1.txt',
                        dsi_security_policy: 1,
                        dsi_embargo_date: '2099-01-01',
                    },
                ],
            },
        }));

        const wrapper = setup();

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});

// describe('input onChange', () => {
//     afterEach(() => cleanup);

//     it('fires when datastreams change', () => {
//         const dataStreamsInitial = [...recordWithDatastreams.fez_datastream_info];
//         const dataStreamsChanged = recordWithDatastreams.fez_datastream_info.slice(1, 2);
//         const onChange = jest.fn();

//         useFormValuesContext.mockImplementation(() => ({
//             formValues: {
//                 fez_datastream_info: dataStreamsInitial,
//             },
//         }));

//         const wrapper = setup({});
//         expect(toJson(wrapper)).toMatchSnapshot();

//         useFormValuesContext.mockImplementation(() => ({
//             formValues: { fez_datastream_info: dataStreamsChanged },
//         }));

//         wrapper.setProps({
//             input: {
//                 onChange,
//             },
//         });
//         wrapper.update();

//         expect(onChange).toHaveBeenCalled();
//     });
// });
