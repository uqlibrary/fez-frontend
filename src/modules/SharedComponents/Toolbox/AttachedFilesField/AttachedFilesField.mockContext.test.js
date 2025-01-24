import React from 'react';
import { AttachedFilesField } from './AttachedFilesField';
import { rtlRender, WithReduxStore, FormProviderWrapper, cleanup, userEvent, preview } from 'test-utils';

import * as UserIsAdmin from 'hooks/userIsAdmin';

jest.mock('../../../../context');
import { useRecordContext } from 'context';

import { recordWithDatastreams } from 'mock/data';

function setup({ values, ...testProps }, renderMethod = rtlRender) {
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
        onRenameAttachedFile: jest.fn(),
        onDeleteAttachedFile: jest.fn(),
        ...restProps,
    };

    return renderMethod(
        <WithReduxStore>
            <FormProviderWrapper
                values={{
                    filesSection: {
                        fez_datastream_info: [],
                        ...values,
                    },
                }}
            >
                <AttachedFilesField {...props} />
            </FormProviderWrapper>
        </WithReduxStore>,
    );
}

describe('DataStreamSecuritySelector component with mockContext', () => {
    const userIsAdmin = jest.spyOn(UserIsAdmin, 'userIsAdmin');
    beforeEach(() => {
        useRecordContext.mockImplementation(() => ({
            record: recordWithDatastreams,
        }));

        userIsAdmin.mockImplementation(() => false);
    });

    afterEach(() => cleanup);

    it('should render with form data', () => {
        const { container } = setup({
            values: {
                fez_datastream_info: [
                    {
                        dsi_dsid: 'test1.txt',
                        dsi_security_policy: 1,
                        dsi_embargo_date: '2099-01-01',
                    },
                ],
            },
        });

        expect(container).toMatchSnapshot();
    });

    it('fires when attachment deleted', async () => {
        userIsAdmin.mockImplementation(() => true);
        const dataStreamsInitial = recordWithDatastreams.fez_datastream_info;
        const onChange = jest.fn();

        const { getByTestId } = setup({
            values: {
                fez_datastream_info: dataStreamsInitial,
            },
            input: { onChange },
            canEdit: true,
        });
        await userEvent.click(getByTestId('delete-file-0'));

        expect(onChange).toHaveBeenCalledTimes(1);
    });
});
