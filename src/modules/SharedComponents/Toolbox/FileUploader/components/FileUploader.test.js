import React from 'react';
import { FileUploader } from './FileUploader';
import { FILE_NAME_RESTRICTION, MIME_TYPE_WHITELIST } from '../config';
import FileUploaderContainer, { getErrorMessage } from './FileUploader';
import locale from '../locale';
import { render, WithReduxStore, fireEvent, waitFor, within } from 'test-utils';

import * as Hook from 'hooks/useWidth';
import moment from 'moment';
import { GENERIC_DATE_FORMAT } from '../../../../../config/general';

const getProps = (testProps = {}) => ({
    clearFileUpload: testProps.clearFileUpload || jest.fn(),
    filesInQueue: [],
    fileNameRestrictions: /.+/,
    ...testProps,
    fileRestrictionsConfig: {
        fileUploadLimit: (testProps.fileRestrictionsConfig && testProps.fileRestrictionsConfig.fileUploadLimit) || 5,
        maxFileSize: 1,
        fileSizeUnit: (testProps.fileRestrictionsConfig && testProps.fileRestrictionsConfig.fileSizeUnit) || 'K',
        fileNameRestrictions: FILE_NAME_RESTRICTION,
        mimeTypeWhitelist: MIME_TYPE_WHITELIST,
    },
});

function setup(testProps = {}) {
    return render(
        <WithReduxStore>
            <FileUploader {...getProps(testProps)} />
        </WithReduxStore>,
    );
}

describe('Component FileUploader', () => {
    const MockDate = require('mockdate');
    beforeEach(() => {
        MockDate.set('2020-01-01T00:00:00.000Z', 10);
    });
    afterEach(() => {
        MockDate.reset();
    });

    it('should render default component', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });

    it('should render security policy selector if admin user', () => {
        const { container } = setup({ requireOpenAccessStatus: true, isAdmin: true });
        expect(container).toMatchSnapshot();
    });

    it('should mount and unmount containers and clear file uploader', () => {
        const { container, unmount } = render(
            <WithReduxStore>
                <FileUploaderContainer
                    {...getProps({
                        isNtro: true,
                        fileRestrictionsConfig: {
                            fileUploadLimit: 5,
                            maxFileSize: 1,
                            fileSizeUnit: 'B',
                            fileNameRestrictions: FILE_NAME_RESTRICTION,
                        },
                    })}
                />
            </WithReduxStore>,
        );

        expect(container).toMatchSnapshot();

        unmount();
        expect(container).toMatchSnapshot();
    });

    it('should render disabled component', () => {
        const { container } = setup({ disabled: true });
        expect(container).toMatchSnapshot();
    });

    it('should render rows for uploaded files', async () => {
        // default view
        const useWidth = jest.spyOn(Hook, 'useWidth');
        useWidth.mockImplementation(() => 'sm');

        const { container, getByText, getByTestId } = setup();
        expect(container).toMatchSnapshot();

        // drag and drop 2 files
        fireEvent.drop(getByTestId('fez-datastream-info-input'), {
            dataTransfer: {
                files: [
                    new File(['hello'], 'hello.png', { type: 'image/png' }),
                    new File(['hello2'], 'hello2.png', { type: 'image/png' }),
                ],
                types: ['Files', 'Files'],
            },
        });

        await waitFor(() => getByText(/hello\.png/i));
        expect(getByText('Successfully added 2 file(s) to upload queue.')).toBeInTheDocument();
        expect(container).toMatchSnapshot();

        // delete first file
        fireEvent.click(getByTestId('dsi-dsid-0-delete'));
        fireEvent.click(getByTestId('confirm-dsi-dsid-delete'));
        expect(container).toMatchSnapshot();

        // delete all files
        fireEvent.click(getByTestId('delete-all-files'));
        fireEvent.click(getByTestId('confirm-delete-all-files'));
        expect(container).toMatchSnapshot();
    });

    it('should render rows for uploaded files with access required', async () => {
        const { container, getByTestId, getByRole, getByText } = setup({ requireOpenAccessStatus: true });
        expect(container).toMatchSnapshot();

        // drag and drop 2 files
        fireEvent.drop(getByTestId('fez-datastream-info-input'), {
            dataTransfer: {
                files: [
                    new File(['hello'], 'hello.png', { type: 'image/png' }),
                    new File(['hello2'], 'hello2.png', { type: 'image/png' }),
                ],
                types: ['Files', 'Files'],
            },
        });

        await waitFor(() => getByText(/hello\.png/i));

        expect(container).toMatchSnapshot();

        fireEvent.mouseDown(getByTestId('dsi-open-access-0-select'));
        fireEvent.click(getByRole('option', { name: 'Closed Access' }));

        expect(container).toMatchSnapshot();

        fireEvent.mouseDown(getByTestId('dsi-open-access-1-select'));
        fireEvent.click(getByRole('option', { name: 'Open Access' }));
        fireEvent.change(within(getByTestId('dsi-embargo-date-1-input')).getByRole('textbox'), {
            target: { value: '02/02/2022' },
        });

        expect(container).toMatchSnapshot();
    });

    it('should update file description', async () => {
        // default view
        const useWidth = jest.spyOn(Hook, 'useWidth');
        useWidth.mockImplementation(() => 'sm');
        const { container, getByTestId, getByText } = setup({ requireOpenAccessStatus: true });
        const descriptionA = 'Test Description A';
        fireEvent.drop(getByTestId('fez-datastream-info-input'), {
            dataTransfer: {
                files: [new File(['hello'], 'hello.png', { type: 'image/png' })],
                types: ['Files'],
            },
        });

        await waitFor(() => getByText(/hello\.png/i));
        fireEvent.change(within(getByTestId('dsi-label-upload-0')).getByRole('textbox'), {
            target: { value: descriptionA },
        });
        expect(container).toMatchSnapshot();
    });

    it('should render rows for uploaded files with security policy', async () => {
        const { container, getByTestId, getByRole, getByText } = setup({
            requireOpenAccessStatus: true,
            isAdmin: true,
        });
        expect(container).toMatchSnapshot();

        // drag and drop 2 files
        fireEvent.drop(getByTestId('fez-datastream-info-input'), {
            dataTransfer: {
                files: [
                    new File(['hello'], 'hello.png', { type: 'image/png' }),
                    new File(['hello2'], 'hello2.png', { type: 'image/png' }),
                ],
                types: ['Files', 'Files'],
            },
        });

        await waitFor(() => getByText(/hello\.png/i));

        expect(container).toMatchSnapshot();

        fireEvent.mouseDown(getByTestId('dsi-security-policy-0-select'));
        fireEvent.click(getByRole('option', { name: 'Administrators' }));

        expect(container).toMatchSnapshot();

        fireEvent.mouseDown(getByTestId('dsi-security-policy-1-select'));
        fireEvent.click(getByRole('option', { name: 'Public' }));

        expect(container).toMatchSnapshot();
    });

    it('should handle file order change', async () => {
        // default view
        const useWidth = jest.spyOn(Hook, 'useWidth');
        useWidth.mockImplementation(() => 'sm');

        const { container, getByTestId, getByText } = setup({ requireOpenAccessStatus: true });
        expect(container).toMatchSnapshot();

        // drag and drop 2 files
        fireEvent.drop(getByTestId('fez-datastream-info-input'), {
            dataTransfer: {
                files: [
                    new File(['hello'], 'hello.png', { type: 'image/png' }),
                    new File(['hello2'], 'hello2.png', { type: 'image/png' }),
                ],
                types: ['Files', 'Files'],
            },
        });

        await waitFor(() => getByText(/hello\.png/i));

        fireEvent.click(getByTestId('new-file-upload-up-1'));
        expect(container).toMatchSnapshot();

        fireEvent.click(getByTestId('new-file-upload-down-0'));
        expect(container).toMatchSnapshot();
    });

    it('should render rows for uploaded files with default access condition based on quick template Id', async () => {
        // default view
        const useWidth = jest.spyOn(Hook, 'useWidth');
        useWidth.mockImplementation(() => 'sm');
        const { container, getByTestId, getByText } = setup({ defaultQuickTemplateId: 3 });
        expect(container).toMatchSnapshot();

        // drag and drop 2 files
        fireEvent.drop(getByTestId('fez-datastream-info-input'), {
            dataTransfer: {
                files: [
                    new File(['hello'], 'hello.png', { type: 'image/png' }),
                    new File(['hello2'], 'hello2.png', { type: 'image/png' }),
                ],
                types: ['Files', 'Files'],
            },
        });

        await waitFor(() => getByText(/hello\.png/i));

        expect(container).toMatchSnapshot();
    });

    it(
        'should not render rows for uploaded files with access condition dropdown ' +
            'based on quick template Id and require open access',
        async () => {
            // where theres default quick template id, seems requireOpenAccessStatus is expected to be false
            // hence no access condition drop down
            // default view
            const useWidth = jest.spyOn(Hook, 'useWidth');
            useWidth.mockImplementation(() => 'sm');
            const { container, getByTestId, getByText } = setup({
                isAdmin: true,
                defaultQuickTemplateId: 3,
                requireOpenAccessStatus: true,
            });
            expect(container).toMatchSnapshot();

            // drag and drop 2 files
            fireEvent.drop(getByTestId('fez-datastream-info-input'), {
                dataTransfer: {
                    files: [
                        new File(['hello'], 'hello.png', { type: 'image/png' }),
                        new File(['hello2'], 'hello2.png', { type: 'image/png' }),
                    ],
                    types: ['Files', 'Files'],
                },
            });

            await waitFor(() => getByText(/hello\.png/i));
            expect(container).toMatchSnapshot();
        },
    );

    it('should set max files error message', async () => {
        const { container, getByTestId, getByText } = setup({ fileRestrictionsConfig: { fileUploadLimit: 1 } });

        // drag and drop 2 files
        fireEvent.drop(getByTestId('fez-datastream-info-input'), {
            dataTransfer: {
                files: [
                    new File(['hello'], 'hello.png', { type: 'image/png' }),
                    new File(['hello2'], 'hello2.png', { type: 'image/png' }),
                ],
                types: ['Files', 'Files'],
            },
        });

        await waitFor(() => getByText(/hello\.png/i));
        expect(
            getByText('Maximum number of files (1) has been exceeded. File(s) (hello2.png) will not be uploaded'),
        ).toBeInTheDocument();
        expect(container).toMatchSnapshot();
    });

    it('should not reset file access or embargo date info when second lot of files dropped', async () => {
        const useWidth = jest.spyOn(Hook, 'useWidth');
        useWidth.mockImplementation(() => 'sm');
        const { container, getByTestId, getByRole, getByText } = setup({ requireOpenAccessStatus: true });
        expect(container).toMatchSnapshot();

        // drag and drop 2 files
        fireEvent.drop(getByTestId('fez-datastream-info-input'), {
            dataTransfer: {
                files: [
                    new File(['hello'], 'hello.png', { type: 'image/png' }),
                    new File(['hello2'], 'hello2.png', { type: 'image/png' }),
                ],
                types: ['Files', 'Files'],
            },
        });

        await waitFor(() => getByText(/hello\.png/i));

        fireEvent.mouseDown(getByTestId('dsi-open-access-0-select'));
        fireEvent.click(getByRole('option', { name: 'Open Access' }));

        expect(container).toMatchSnapshot();

        fireEvent.mouseDown(getByTestId('dsi-open-access-1-select'));
        fireEvent.click(getByRole('option', { name: 'Closed Access' }));

        // drag and drop another 2 files
        fireEvent.drop(getByTestId('fez-datastream-info-input'), {
            dataTransfer: {
                files: [
                    new File(['hello3'], 'hello3.png', { type: 'image/png' }),
                    new File(['hello4'], 'hello4.png', { type: 'image/png' }),
                ],
                types: ['Files', 'Files'],
            },
        });

        await waitFor(() => getByText(/hello3\.png/i));
        expect(getByTestId('dsi-open-access-0-select')).toHaveTextContent('Open Access');
        expect(getByTestId('dsi-open-access-1-select')).toHaveTextContent('Closed Access');
    });

    it(
        'should accept terms and condition and reset back to not accepted state if ' +
            'access condition changed back to closed access',
        async () => {
            const { getByTestId, queryByTestId, getByRole, getByText } = setup({
                requireOpenAccessStatus: true,
            });
            // drag and drop a file
            fireEvent.drop(getByTestId('fez-datastream-info-input'), {
                dataTransfer: {
                    files: [new File(['hello'], 'hello.png', { type: 'image/png' })],
                    types: ['Files'],
                },
            });

            await waitFor(() => getByText(/hello/i));

            fireEvent.mouseDown(getByTestId('dsi-open-access-0-select'));
            fireEvent.click(getByRole('option', { name: 'Open Access' }));

            expect(getByTestId('terms-and-conditions-input').checked).toBeFalsy();
            fireEvent.click(getByTestId('terms-and-conditions-input'));
            expect(getByTestId('terms-and-conditions-input').checked).toBeTruthy();

            fireEvent.mouseDown(getByTestId('dsi-open-access-0-select'));
            fireEvent.click(getByRole('option', { name: 'Closed Access' }));

            expect(queryByTestId('terms-and-conditions-input')).not.toBeInTheDocument();
        },
    );

    it(
        'should accept terms and condition and reset back to not accepted state if ' +
            'security policy changed back to non-public',
        async () => {
            const { getByTestId, queryByTestId, getByRole, getByText } = setup({
                requireOpenAccessStatus: true,
                isAdmin: true,
            });

            // drag and drop a file
            fireEvent.drop(getByTestId('fez-datastream-info-input'), {
                dataTransfer: {
                    files: [new File(['hello'], 'hello.png', { type: 'image/png' })],
                    types: ['Files'],
                },
            });

            await waitFor(() => getByText(/hello/i));

            fireEvent.mouseDown(getByTestId('dsi-security-policy-0-select'));
            fireEvent.click(getByRole('option', { name: 'Public' }));

            expect(getByTestId('terms-and-conditions-input').checked).toBeFalsy();
            fireEvent.click(getByTestId('terms-and-conditions-input'));
            expect(getByTestId('terms-and-conditions-input').checked).toBeTruthy();

            fireEvent.mouseDown(getByTestId('dsi-security-policy-0-select'));
            fireEvent.click(getByRole('option', { name: 'Administrators' }));

            expect(queryByTestId('terms-and-conditions-input')).not.toBeInTheDocument();

            fireEvent.mouseDown(getByTestId('dsi-security-policy-0-select'));
            fireEvent.click(getByRole('option', { name: 'Public' }));

            expect(getByTestId('terms-and-conditions-input').checked).toBeFalsy();
        },
    );

    it('should return false if any file has open access with date selected but the terms and conditions not accepted', async () => {
        const onChangeFn = jest.fn();
        const { getByTestId, getByRole, getByText } = setup({ requireOpenAccessStatus: true, onChange: onChangeFn });

        // drag and drop a file
        fireEvent.drop(getByTestId('fez-datastream-info-input'), {
            dataTransfer: {
                files: [
                    new File(['hello'], 'hello.png', { type: 'image/png' }),
                    new File(['hello2'], 'hello2.png', { type: 'image/png' }),
                ],
                types: ['Files', 'Files'],
            },
        });

        await waitFor(() => getByText(/hello\.png/i));

        fireEvent.mouseDown(getByTestId('dsi-open-access-0-select'));
        fireEvent.click(getByRole('option', { name: 'Closed Access' }));

        fireEvent.mouseDown(getByTestId('dsi-open-access-1-select'));
        fireEvent.click(getByRole('option', { name: 'Open Access' }));

        fireEvent.change(within(getByTestId('dsi-embargo-date-1-input')).getByRole('textbox'), {
            target: { value: '01/01/2017' },
        });

        expect(getByTestId('terms-and-conditions-input').checked).toBeFalsy();
        expect(onChangeFn).toHaveBeenCalledWith(expect.objectContaining({ isValid: false }));
    });

    it('should return false if any file has security policy with date selected but the terms and conditions not accepted', async () => {
        const onChangeFn = jest.fn();
        const { getByTestId, getByText, getByRole } = setup({
            requireOpenAccessStatus: true,
            isAdmin: true,
            onChange: onChangeFn,
        });

        // drag and drop a file
        fireEvent.drop(getByTestId('fez-datastream-info-input'), {
            dataTransfer: {
                files: [
                    new File(['hello'], 'hello.png', { type: 'image/png' }),
                    new File(['hello2'], 'hello2.png', { type: 'image/png' }),
                ],
                types: ['Files', 'Files'],
            },
        });

        await waitFor(() => getByText(/hello\.png/i));

        fireEvent.mouseDown(getByTestId('dsi-security-policy-0-select'));
        fireEvent.click(getByRole('option', { name: 'Administrators' }));

        fireEvent.mouseDown(getByTestId('dsi-security-policy-1-select'));
        fireEvent.click(getByRole('option', { name: 'Public' }));

        fireEvent.change(within(getByTestId('dsi-embargo-date-1-input')).getByRole('textbox'), {
            target: { value: '01/01/2017' },
        });

        expect(getByTestId('terms-and-conditions-input').checked).toBeFalsy();
        expect(onChangeFn).toHaveBeenCalledWith(expect.objectContaining({ isValid: false }));
    });

    it('should return true on if all files are closed access', async () => {
        const onChangeFn = jest.fn();
        const { getByTestId, getByText, getByRole } = setup({
            requireOpenAccessStatus: true,
            isAdmin: true,
            onChange: onChangeFn,
        });

        // drag and drop a file
        fireEvent.drop(getByTestId('fez-datastream-info-input'), {
            dataTransfer: {
                files: [
                    new File(['hello'], 'hello.png', { type: 'image/png' }),
                    new File(['hello2'], 'hello2.png', { type: 'image/png' }),
                ],
                types: ['Files', 'Files'],
            },
        });

        await waitFor(() => getByText(/hello\.png/i));

        fireEvent.mouseDown(getByTestId('dsi-security-policy-0-select'));
        fireEvent.click(getByRole('option', { name: 'Administrators' }));

        fireEvent.mouseDown(getByTestId('dsi-security-policy-1-select'));
        fireEvent.click(getByRole('option', { name: 'Administrators' }));

        expect(onChangeFn).toHaveBeenCalledWith(expect.objectContaining({ isValid: true }));
    });

    it('should return true on if any file is open access with date selected and terms and conditions accepted', async () => {
        const onChangeFn = jest.fn();
        const { getByTestId, getByRole, getByText } = setup({ requireOpenAccessStatus: true, onChange: onChangeFn });

        // drag and drop a file
        fireEvent.drop(getByTestId('fez-datastream-info-input'), {
            dataTransfer: {
                files: [
                    new File(['hello'], 'hello.png', { type: 'image/png' }),
                    new File(['hello2'], 'hello2.png', { type: 'image/png' }),
                ],
                types: ['Files', 'Files'],
            },
        });

        await waitFor(() => getByText(/hello\.png/i));

        fireEvent.mouseDown(getByTestId('dsi-open-access-0-select'));
        fireEvent.click(getByRole('option', { name: 'Closed Access' }));

        fireEvent.mouseDown(getByTestId('dsi-open-access-1-select'));
        fireEvent.click(getByRole('option', { name: 'Open Access' }));

        fireEvent.change(within(getByTestId('dsi-embargo-date-1-input')).getByRole('textbox'), {
            target: { value: moment().format(GENERIC_DATE_FORMAT) },
        });

        fireEvent.click(getByTestId('terms-and-conditions-input'));
        expect(onChangeFn).toHaveBeenCalledWith(expect.objectContaining({ isValid: true }));
    });

    it('should return false on if any file is open access with invalid date selected and terms and conditions accepted', async () => {
        const onChangeFn = jest.fn();
        const { getByTestId, getByRole, getByText } = setup({ requireOpenAccessStatus: true, onChange: onChangeFn });

        // drag and drop a file
        fireEvent.drop(getByTestId('fez-datastream-info-input'), {
            dataTransfer: {
                files: [
                    new File(['hello'], 'hello.png', { type: 'image/png' }),
                    new File(['hello2'], 'hello2.png', { type: 'image/png' }),
                ],
                types: ['Files', 'Files'],
            },
        });

        await waitFor(() => getByText(/hello\.png/i));

        fireEvent.mouseDown(getByTestId('dsi-open-access-0-select'));
        fireEvent.click(getByRole('option', { name: 'Closed Access' }));

        fireEvent.mouseDown(getByTestId('dsi-open-access-1-select'));
        fireEvent.click(getByRole('option', { name: 'Open Access' }));

        fireEvent.change(within(getByTestId('dsi-embargo-date-1-input')).getByRole('textbox'), {
            target: { value: '01/01/1111' },
        });

        fireEvent.click(getByTestId('terms-and-conditions-input'));
        expect(onChangeFn).toHaveBeenCalledWith(expect.objectContaining({ isValid: false }));
    });

    it('should return false on if access condition is not selected for any files', async () => {
        const onChangeFn = jest.fn();
        const { getByTestId, getByText } = setup({
            requireOpenAccessStatus: true,
            isTermsAndConditionsAccepted: false,
            onChange: onChangeFn,
        });

        // drag and drop a file
        fireEvent.drop(getByTestId('fez-datastream-info-input'), {
            dataTransfer: {
                files: [
                    new File(['hello'], 'hello.png', { type: 'image/png' }),
                    new File(['hello2'], 'hello2.png', { type: 'image/png' }),
                ],
                types: ['Files', 'Files'],
            },
        });

        await waitFor(() => getByText(/hello\.png/i));

        expect(onChangeFn).toHaveBeenCalledWith(expect.objectContaining({ isValid: false }));
    });

    it('should get correct error message based on errors object', () => {
        expect(
            getErrorMessage(
                {
                    tooManyFiles: ['a.txt', 'b.txt'],
                    duplicateFiles: ['c.txt', 'd.txt'],
                    invalidFileNames: ['web_a.txt'],
                    invalidMimeTypeFiles: ['web_a.txt'],
                    notFiles: ['someFolder'],
                    tooBigFiles: ['big_file.txt'],
                },
                locale,
                getProps().fileRestrictionsConfig,
            ),
        ).toEqual(
            'Maximum number of files (5) has been exceeded. File(s) (a.txt, b.txt) will not be uploaded; File(s)' +
                ' (c.txt, d.txt) are duplicates and have been ignored; File(s) (web_a.txt) have invalid file name;' +
                ' File(s) (web_a.txt) are not supported; Invalid files (someFolder); File(s) (big_file.txt)' +
                ' exceed maximum allowed upload file size',
        );
    });

    it('should get empty string as an error message', () => {
        expect(
            getErrorMessage(
                {
                    tooManyFiles: [],
                    duplicateFiles: [],
                    invalidFileNames: [],
                    invalidMimeTypeFiles: [],
                    notFiles: [],
                    tooBigFiles: [],
                },
                locale,
                getProps().fileRestrictionsConfig,
            ),
        ).toEqual('');
    });

    it('should keep terms and conditions as accepted on file delete if any of remaining files are open access', async () => {
        const { getByTestId, getByText, getByRole } = setup({ requireOpenAccessStatus: true });
        // drag and drop a file
        fireEvent.drop(getByTestId('fez-datastream-info-input'), {
            dataTransfer: {
                files: [
                    new File(['hello'], 'hello.png', { type: 'image/png' }),
                    new File(['hello2'], 'hello2.png', { type: 'image/png' }),
                ],
                types: ['Files', 'Files'],
            },
        });

        await waitFor(() => getByText(/hello\.png/i));

        fireEvent.mouseDown(getByTestId('dsi-open-access-0-select'));
        fireEvent.click(getByRole('option', { name: 'Closed Access' }));

        fireEvent.mouseDown(getByTestId('dsi-open-access-1-select'));
        fireEvent.click(getByRole('option', { name: 'Open Access' }));

        fireEvent.change(within(getByTestId('dsi-embargo-date-1-input')).getByRole('textbox'), {
            target: { value: '01/01/2017' },
        });

        fireEvent.click(getByTestId('terms-and-conditions-input'));
        expect(getByTestId('terms-and-conditions-input').checked).toBeTruthy();

        // delete first file
        fireEvent.click(getByTestId('dsi-dsid-0-delete'));
        fireEvent.click(getByTestId('confirm-dsi-dsid-delete'));
        expect(getByTestId('terms-and-conditions-input').checked).toBeTruthy();
    });
});
