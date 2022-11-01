import { AttachedFilesField } from './AttachedFilesField';
import { cleanup } from 'test-utils';

jest.mock('../../../../context');
import { useRecordContext, useFormValuesContext } from 'context';

import { recordWithDatastreams } from 'mock/data';

function setup(testProps = {}, args = { isShallow: true }) {
    const { locale, ...restProps } = testProps;
    const props = {
        input: {},
        dataStreams: recordWithDatastreams.fez_datastream_info,
        locale: {
            title: 'Files',
            renamingFilesInstructions: {
                title: 'File attachments',
                text: 'TEST ALERT',
            },
            ...locale,
        },
        ...restProps,
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

    it('fires when attachment deleted', () => {
        const dataStreamsInitial = recordWithDatastreams.fez_datastream_info;
        const dataStreamsChanged = dataStreamsInitial.slice(1); // remove first item

        const onChange = jest.fn();

        useRecordContext.mockImplementation(() => ({
            record: recordWithDatastreams,
        }));

        useFormValuesContext.mockImplementation(() => ({
            formValues: {
                fez_datastream_info: dataStreamsInitial,
            },
        }));

        const wrapper = setup(
            {
                input: {
                    onChange,
                },
            },
            { isShallow: false },
        );

        useFormValuesContext.mockImplementation(() => ({
            formValues: { fez_datastream_info: dataStreamsChanged },
        }));

        wrapper.setProps({
            input: {
                onChange,
            },
        });
        wrapper.update();

        expect(onChange).toHaveBeenCalledTimes(1);
    });
});
