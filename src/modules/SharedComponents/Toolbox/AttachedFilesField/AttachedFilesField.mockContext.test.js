import React from 'react';
import { AttachedFilesField } from './AttachedFilesField';
import { rtlRender, cleanup } from 'test-utils';

jest.mock('../../../../context');
import { useRecordContext, useFormValuesContext } from 'context';

import { recordWithDatastreams } from 'mock/data';

function setup(testProps = {}, renderMethod = rtlRender) {
    const { locale, ...restProps } = testProps;
    const props = {
        input: { onChange: jest.fn() },
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

    return renderMethod(<AttachedFilesField {...props} />);
}

describe('DataStreamSecuritySelector component with mockContext', () => {
    beforeEach(() => {
        useRecordContext.mockImplementation(() => ({
            record: recordWithDatastreams,
        }));
    });

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

        const { container } = setup();

        expect(container).toMatchSnapshot();
    });

    it('fires when attachment deleted', () => {
        const dataStreamsInitial = recordWithDatastreams.fez_datastream_info;
        const dataStreamsChanged = dataStreamsInitial.slice(1); // remove first item
        const onChange = jest.fn();

        useFormValuesContext.mockImplementation(() => ({
            formValues: {
                fez_datastream_info: dataStreamsInitial,
            },
        }));

        const { rerender } = setup({ input: { onChange } });

        useFormValuesContext.mockImplementation(() => ({
            formValues: { fez_datastream_info: dataStreamsChanged },
        }));

        setup({ input: { onChange } }, rerender);

        expect(onChange).toHaveBeenCalledTimes(1);
    });
});
