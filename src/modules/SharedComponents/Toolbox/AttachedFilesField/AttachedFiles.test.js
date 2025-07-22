import React from 'react';
import AttachedFiles, { getFileOpenAccessStatus, checkFileNamesForDupes, getFilenameId } from './AttachedFiles';
import { recordWithDatastreams } from 'mock/data';
import {
    rtlRender,
    WithReduxStore,
    FormProviderWrapper,
    userEvent,
    fireEvent,
    waitFor,
    act,
    createMatchMedia,
    within,
} from 'test-utils';
import { openAccessConfig } from 'config';
import * as fileUploadLocale from '../FileUploader/locale';
import * as UserIsAdminHook from 'hooks/userIsAdmin';

jest.mock('context');
import { useRecordContext } from 'context';
import {
    AV_CHECK_STATE_CLEAN,
    AV_CHECK_STATE_INFECTED,
    AV_CHECK_STATE_UNSCANNABLE,
    CURRENT_LICENCES,
    GENERIC_DATE_FORMAT,
    SENSITIVE_HANDLING_NOTE_OTHER_TYPE,
    SENSITIVE_HANDLING_NOTE_TYPE,
} from '../../../../config/general';
import { journalArticle } from '../../../../mock/data/testing/records';
import { getAvState } from '../../../../helpers/datastreams';
import { getTestId as getAvStateIconTestId } from '../FileAvStateIcon/FileAvStateIcon';
import { createFezDatastreamInfoArray, withDatastreams } from 'test-utils';
import { getDownloadLinkTestId, getPreviewLinkTestId } from '../../../ViewRecord/components/partials/FileName';
import moment from 'moment';

jest.mock('react-player', () => () => <div>Mock React Player</div>);

function setup({ values, ...testProps } = {}, renderer = rtlRender) {
    const { locale, ...restProps } = testProps;
    const props = {
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
        openAccessStatusId: 0,
        ...restProps,
    };
    return renderer(
        <WithReduxStore>
            <FormProviderWrapper
                values={{
                    filesSection: {
                        fez_datastream_info: [],
                        ...values,
                    },
                }}
            >
                <AttachedFiles {...props} />
            </FormProviderWrapper>
        </WithReduxStore>,
    );
}

describe('AttachedFiles component', () => {
    beforeAll(() => {
        useRecordContext.mockImplementation(() => ({
            record: recordWithDatastreams,
        }));
    });

    describe('AV Check', () => {
        const sources = [
            {
                dsi_dsid: 'cats.tiff',
            },
            {
                dsi_dsid: 'dogs.tiff',
                dsi_av_check_state: AV_CHECK_STATE_INFECTED,
                dsi_av_check_date: '2000-01-01 00:00:00',
            },
            {
                dsi_dsid: 'birds.tiff',
                dsi_av_check_state: AV_CHECK_STATE_CLEAN,
                dsi_av_check_date: '2000-01-01 00:00:00',
            },
            {
                dsi_dsid: 'fish.tiff',
                dsi_av_check_state: AV_CHECK_STATE_UNSCANNABLE,
                dsi_av_check_date: '2000-01-01 00:00:00',
            },
            {
                dsi_dsid: 'interview.wav',
                dsi_av_check_state: AV_CHECK_STATE_CLEAN,
                dsi_av_check_date: '2000-01-01 00:00:00',
            },
            {
                dsi_dsid: 'big-file.zip',
                dsi_av_check_state: AV_CHECK_STATE_UNSCANNABLE,
                dsi_av_check_date: '2000-01-01 00:00:00',
            },
        ];

        it('should render the proper av status icon', () => {
            const fezDatastreamInfo = createFezDatastreamInfoArray(sources, journalArticle.rek_pid);
            const { queryByTestId } = setup({ dataStreams: fezDatastreamInfo });

            expect(fezDatastreamInfo).toMatchSnapshot();
            withDatastreams(sources, fezDatastreamInfo, (item, source, isDerivative) => {
                const avStateIcon = queryByTestId(
                    getAvStateIconTestId(getAvState(source.dsi_av_check_state), item.dsi_id),
                );
                if (!isDerivative) {
                    expect(avStateIcon).toBeInTheDocument();
                    return;
                }
                expect(avStateIcon).not.toBeInTheDocument();
                expect(queryByTestId(getAvStateIconTestId(getAvState(), item.dsi_id))).not.toBeInTheDocument();
            });
        });

        it('should render download link infected files, preview link for non infected and none for derivatives', () => {
            const fezDatastreamInfo = createFezDatastreamInfoArray(sources, recordWithDatastreams.rek_pid);
            const { queryByTestId } = setup({ dataStreams: fezDatastreamInfo });

            expect(fezDatastreamInfo).toMatchSnapshot();
            withDatastreams(sources, fezDatastreamInfo, (item, source, isDerivative) => {
                const id = getFilenameId(item.dsi_id);
                const previewLink = queryByTestId(getPreviewLinkTestId(id));
                const downloadLink = queryByTestId(`${getDownloadLinkTestId(id)}-link`);
                if (!isDerivative) {
                    if (
                        item.dsi_av_check_state === AV_CHECK_STATE_INFECTED ||
                        item.dsi_dsid.includes('interview.wav') ||
                        item.dsi_dsid.includes('big-file.zip')
                    ) {
                        expect(previewLink).not.toBeInTheDocument();
                        expect(downloadLink).toBeInTheDocument();
                        return;
                    }
                    expect(previewLink).toBeInTheDocument();
                    expect(downloadLink).not.toBeInTheDocument();
                    return;
                }
                expect(previewLink).not.toBeInTheDocument();
                expect(downloadLink).not.toBeInTheDocument();
            });
        });
    });

    it('should render with default props', () => {
        const { container } = setup({ dataStreams: [] });
        expect(container).toMatchSnapshot();
    });

    it('should render default view', () => {
        const { getByText, queryByText } = setup({});
        expect(getByText('MyUQeSpace_Researcher_Guidelines_current.pdf')).toBeInTheDocument();
        expect(getByText('My_UQ_eSpace_researcher_guidelines_2012.pdf')).toBeInTheDocument();
        expect(getByText('My_UQ_eSpace_researcher_guidelines_2014.pdf')).toBeInTheDocument();
        expect(getByText('My_UQ_eSpace_UPO_guidelines.pdf')).toBeInTheDocument();
        expect(getByText('My_UQ_eSpace_UPO_guidelines_2013.pdf')).toBeInTheDocument();
        expect(getByText('My_UQ_eSpace_UPO_guidelines_2016.pdf')).toBeInTheDocument();
        expect(getByText('UQ_eSpace_My_Research_091119.pdf')).toBeInTheDocument();
        expect(getByText('UQ_eSpace_My_Research_091119_old.pdf')).toBeInTheDocument();

        // Admin files should be hidden for non-admin users
        expect(queryByText('FezACML_My_UQ_eSpace_researcher_guidelines_2012.pdf.xml')).not.toBeInTheDocument();
        expect(queryByText('FezACML_My_UQ_eSpace_researcher_guidelines_2014.pdf.xml')).not.toBeInTheDocument();
        expect(queryByText('FezACML_My_UQ_eSpace_UPO_guidelines.pdf.xml')).not.toBeInTheDocument();
        expect(queryByText('FezACML_My_UQ_eSpace_UPO_guidelines_2013.pdf.xml')).not.toBeInTheDocument();
        expect(queryByText('FezACML_My_UQ_eSpace_UPO_guidelines_2016.pdf.xml')).not.toBeInTheDocument();
        expect(queryByText('FezACML_UQ_252236.xml')).not.toBeInTheDocument();
        expect(queryByText('FezACML_UQ_eSpace_My_Research_091119.pdf.xml')).not.toBeInTheDocument();
        expect(queryByText('FezACML_UQ_eSpace_My_Research_091119_old.pdf.xml')).not.toBeInTheDocument();
        expect(queryByText('presmd_MyUQeSpaceResearcherGuidelines_compressed.xml')).not.toBeInTheDocument();
        expect(queryByText('presmd_MyUQeSpace_Researcher_Guidelines_current.xml')).not.toBeInTheDocument();
        expect(queryByText('presmd_My_UQ_eSpace_researcher_guidelines.xml')).not.toBeInTheDocument();
        expect(queryByText('presmd_My_UQ_eSpace_researcher_guidelines_2012.xml')).not.toBeInTheDocument();
        expect(queryByText('presmd_My_UQ_eSpace_researcher_guidelines_2014.xml')).not.toBeInTheDocument();
        expect(queryByText('presmd_My_UQ_eSpace_UPO_guidelines.xml')).not.toBeInTheDocument();
        expect(queryByText('presmd_My_UQ_eSpace_UPO_guidelines_2013.xml')).not.toBeInTheDocument();
        expect(queryByText('presmd_My_UQ_eSpace_UPO_guidelines_2016.xml')).not.toBeInTheDocument();
        expect(queryByText('presmd_UQ_eSpace_My_Research_091119.xml')).not.toBeInTheDocument();
        expect(queryByText('presmd_UQ_eSpace_My_Research_091119_old.xml')).not.toBeInTheDocument();
    });

    it('should render admin view', () => {
        const userIsAdmin = jest.spyOn(UserIsAdminHook, 'userIsAdmin');
        userIsAdmin.mockImplementation(() => true);
        const { getByText } = setup({ canEdit: true });
        // each field should be in the document twice
        expect(getByText('MyUQeSpace_Researcher_Guidelines_current.pdf')).toBeInTheDocument();
        expect(getByText('My_UQ_eSpace_researcher_guidelines_2012.pdf')).toBeInTheDocument();
        expect(getByText('My_UQ_eSpace_researcher_guidelines_2014.pdf')).toBeInTheDocument();
        expect(getByText('My_UQ_eSpace_UPO_guidelines.pdf')).toBeInTheDocument();
        expect(getByText('My_UQ_eSpace_UPO_guidelines_2013.pdf')).toBeInTheDocument();
        expect(getByText('My_UQ_eSpace_UPO_guidelines_2016.pdf')).toBeInTheDocument();
        expect(getByText('UQ_eSpace_My_Research_091119.pdf')).toBeInTheDocument();
        expect(getByText('UQ_eSpace_My_Research_091119_old.pdf')).toBeInTheDocument();

        // Admin files should be shown for admin users
        expect(getByText('FezACML_My_UQ_eSpace_researcher_guidelines_2012.pdf.xml')).toBeInTheDocument();
        expect(getByText('FezACML_My_UQ_eSpace_researcher_guidelines_2014.pdf.xml')).toBeInTheDocument();
        expect(getByText('FezACML_My_UQ_eSpace_UPO_guidelines.pdf.xml')).toBeInTheDocument();
        expect(getByText('FezACML_My_UQ_eSpace_UPO_guidelines_2013.pdf.xml')).toBeInTheDocument();
        expect(getByText('FezACML_My_UQ_eSpace_UPO_guidelines_2016.pdf.xml')).toBeInTheDocument();
        expect(getByText('FezACML_UQ_252236.xml')).toBeInTheDocument();
        expect(getByText('FezACML_UQ_eSpace_My_Research_091119.pdf.xml')).toBeInTheDocument();
        expect(getByText('FezACML_UQ_eSpace_My_Research_091119_old.pdf.xml')).toBeInTheDocument();
        expect(getByText('presmd_MyUQeSpaceResearcherGuidelines_compressed.xml')).toBeInTheDocument();
        expect(getByText('presmd_MyUQeSpace_Researcher_Guidelines_current.xml')).toBeInTheDocument();
        expect(getByText('presmd_My_UQ_eSpace_researcher_guidelines.xml')).toBeInTheDocument();
        expect(getByText('presmd_My_UQ_eSpace_researcher_guidelines_2012.xml')).toBeInTheDocument();
        expect(getByText('presmd_My_UQ_eSpace_researcher_guidelines_2014.xml')).toBeInTheDocument();
        expect(getByText('presmd_My_UQ_eSpace_UPO_guidelines.xml')).toBeInTheDocument();
        expect(getByText('presmd_My_UQ_eSpace_UPO_guidelines_2013.xml')).toBeInTheDocument();
        expect(getByText('presmd_My_UQ_eSpace_UPO_guidelines_2016.xml')).toBeInTheDocument();
        expect(getByText('presmd_UQ_eSpace_My_Research_091119.xml')).toBeInTheDocument();
        expect(getByText('presmd_UQ_eSpace_My_Research_091119_old.xml')).toBeInTheDocument();
    });

    it('should render empty view', () => {
        const { asFragment } = setup({ dataStreams: [] });
        expect(asFragment()).toMatchInlineSnapshot('<DocumentFragment />');
    });

    it('should render admin edit view', () => {
        const userIsAdmin = jest.spyOn(UserIsAdminHook, 'userIsAdmin');
        userIsAdmin.mockImplementation(() => true);
        const onDeleteFn = jest.fn();
        const onDescriptionChangeFn = jest.fn();
        const onOrderChangeFn = jest.fn();
        const { getByTestId } = setup({
            canEdit: true,
            onDelete: onDeleteFn,
            onDescriptionChange: onDescriptionChangeFn,
            onOrderChange: onOrderChangeFn,
        });

        fireEvent.click(getByTestId('delete-file-3'));
        expect(onDeleteFn).toHaveBeenCalledWith('FezACML_UQ_252236.xml');

        fireEvent.change(getByTestId('dsi-label-2-input'), { target: { value: 'test file description' } });
        expect(onDescriptionChangeFn).toHaveBeenCalledWith('dsi_label', 'test file description', 2);

        fireEvent.click(getByTestId('order-down-file-1'));
        expect(onOrderChangeFn).toHaveBeenCalledWith(2, 2, 3);

        fireEvent.click(getByTestId('order-up-file-2'));
        expect(onOrderChangeFn).toHaveBeenLastCalledWith(3, 3, 2);
    });

    it('should render embargo date field for open access file with embargo date in future', async () => {
        const userIsAdmin = jest.spyOn(UserIsAdminHook, 'userIsAdmin');
        userIsAdmin.mockImplementation(() => true);
        useRecordContext.mockImplementationOnce(() => ({
            record: { fez_record_search_key_oa_status: { rek_oa_status: 453695 } },
        }));
        const onDateChangeFn = jest.fn();
        const { getByText, getAllByRole } = setup({
            canEdit: true,
            disabled: false,
            openAccessStatusId: 453697,
            dataStreams: [
                {
                    dsi_id: '252236',
                    dsi_pid: 'UQ:252236',
                    dsi_dsid: 'My_UQ_eSpace_UPO_guidelines_2016.pdf',
                    dsi_embargo_date: '2018-01-01',
                    dsi_label: 'UPO Guide v.4',
                    dsi_mimetype: 'application/pdf',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 587005,
                    dsi_security_inherited: 1,
                    dsi_security_policy: 5,
                },
            ],
            onDateChange: onDateChangeFn,
            onDelete: jest.fn(),
        });

        act(() => {
            fireEvent.click(getAllByRole('button')[2]);
        });

        const calendar = await waitFor(() => getAllByRole('presentation')[0]);
        fireEvent.click(getByText('26', calendar));
        expect(onDateChangeFn).toHaveBeenCalledWith('dsi_embargo_date', '2018-01-26', 0);
    });

    it('should render embargo date field for public files with embargo date in future', async () => {
        const userIsAdmin = jest.spyOn(UserIsAdminHook, 'userIsAdmin');
        userIsAdmin.mockImplementation(() => true);
        const onDateChangeFn = jest.fn();
        const { getByText, getAllByRole } = setup({
            canEdit: true,
            dataStreams: [
                {
                    dsi_id: '252236',
                    dsi_pid: 'UQ:252236',
                    dsi_dsid: 'My_UQ_eSpace_UPO_guidelines_2016.pdf',
                    dsi_embargo_date: '2018-01-01',
                    dsi_label: 'UPO Guide v.4',
                    dsi_mimetype: 'application/pdf',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 587005,
                    dsi_security_inherited: 1,
                    dsi_security_policy: 1,
                },
            ],
            onDateChange: onDateChangeFn,
        });

        act(() => {
            fireEvent.click(getAllByRole('button')[2]);
        });

        const calendar = await waitFor(() => getAllByRole('presentation')[0]);
        fireEvent.click(getByText('26', calendar));
        expect(onDateChangeFn).toHaveBeenCalledWith('dsi_embargo_date', '2018-01-26', 0);
    });

    it('should yield a warning when entering an invalid embargo date', async () => {
        const userIsAdmin = jest.spyOn(UserIsAdminHook, 'userIsAdmin');
        userIsAdmin.mockImplementation(() => true);

        const datastream = [
            {
                dsi_id: '252236',
                dsi_pid: 'UQ:252236',
                dsi_dsid: 'My_UQ_eSpace_UPO_guidelines_2016.pdf',
                dsi_embargo_date: '2018-01-01',
                dsi_label: 'UPO Guide v.4',
                dsi_mimetype: 'application/pdf',
                dsi_copyright: null,
                dsi_state: 'A',
                dsi_size: 587005,
                dsi_security_inherited: 1,
                dsi_security_policy: 1,
            },
        ];

        const { getByTestId } = setup({
            canEdit: true,
            dataStreams: datastream,
            onDateChange: jest.fn(),
        });

        // set embargo date to an invalid date
        // act(() => {
        await userEvent.type(getByTestId('dsi-embargo-date-0-input').firstChild, '12122222');
        // });
        // make sure the invalid date warning has been raised
        const alert = await waitFor(() => getByTestId('alert-files'));
        expect(alert).toHaveTextContent(
            fileUploadLocale.default.fileUploadRow.invalidEmbargoDateWarning(datastream[0].dsi_dsid),
        );
        // change to a valid date
        // act(() => {
        await userEvent.type(getByTestId('dsi-embargo-date-0-input').firstChild, moment().format(GENERIC_DATE_FORMAT));
        // });
        // make sure the warning has been cleared
        expect(alert).not.toBeInTheDocument();
    });

    it('should hide a raised invalid embargo date warning when using the backspace key', async () => {
        const userIsAdmin = jest.spyOn(UserIsAdminHook, 'userIsAdmin');
        userIsAdmin.mockImplementation(() => true);

        const datastream = [
            {
                dsi_id: '252236',
                dsi_pid: 'UQ:252236',
                dsi_dsid: 'My_UQ_eSpace_UPO_guidelines_2016.pdf',
                dsi_embargo_date: '2018-01-01',
                dsi_label: 'UPO Guide v.4',
                dsi_mimetype: 'application/pdf',
                dsi_copyright: null,
                dsi_state: 'A',
                dsi_size: 587005,
                dsi_security_inherited: 1,
                dsi_security_policy: 1,
            },
        ];

        const { getByTestId } = setup({
            canEdit: true,
            dataStreams: datastream,
            onDateChange: jest.fn(),
        });

        // set embargo date to an invalid date
        await userEvent.type(getByTestId('dsi-embargo-date-0-input').firstChild, '12122222');

        // make sure the invalid date warning has been raised
        const alert = await waitFor(() => getByTestId('alert-files'));
        expect(alert).toHaveTextContent(
            fileUploadLocale.default.fileUploadRow.invalidEmbargoDateWarning(datastream[0].dsi_dsid),
        );

        await userEvent.type(getByTestId('dsi-embargo-date-0-input').firstChild, '1');

        expect(alert).toHaveTextContent(
            fileUploadLocale.default.fileUploadRow.invalidEmbargoDateWarning(datastream[0].dsi_dsid),
        );
        // clear date with backspace
        await userEvent.type(getByTestId('dsi-embargo-date-0-input').firstChild, '{backspace}');

        // make sure the warning has been cleared
        expect(alert).not.toBeInTheDocument();
    });

    it('should show general alert information for file renaming', () => {
        const userIsAdmin = jest.spyOn(UserIsAdminHook, 'userIsAdmin');
        userIsAdmin.mockImplementation(() => true);

        const { getByText } = setup({
            canEdit: true,
        });

        expect(getByText('TEST ALERT')).toBeInTheDocument();
    });

    it('should show alert for sensitive handling note', () => {
        const userIsAdmin = jest.spyOn(UserIsAdminHook, 'userIsAdmin');
        userIsAdmin.mockImplementation(() => true);
        const note = SENSITIVE_HANDLING_NOTE_TYPE.find(item => item.value !== 'Other');
        useRecordContext.mockImplementation(() => ({
            record: {
                fez_record_search_key_sensitive_handling_note_id: {
                    rek_sensitive_handling_note_id: note.value,
                },
            },
        }));

        const { getByText } = setup({
            canEdit: true,
        });

        expect(getByText(note.text)).toBeInTheDocument();
    });

    it('should show alert for sensitive handling note - other', () => {
        const userIsAdmin = jest.spyOn(UserIsAdminHook, 'userIsAdmin');
        const text = 'sensitive handling note';
        userIsAdmin.mockImplementation(() => true);
        useRecordContext.mockImplementation(() => ({
            record: {
                fez_record_search_key_sensitive_handling_note_id: {
                    rek_sensitive_handling_note_id: SENSITIVE_HANDLING_NOTE_OTHER_TYPE,
                },
                fez_record_search_key_sensitive_handling_note_other: {
                    rek_sensitive_handling_note_other: 'sensitive handling note',
                },
            },
        }));

        const { getByText } = setup({
            canEdit: true,
        });

        expect(getByText(text)).toBeInTheDocument();
    });

    it('should toggle preview', async () => {
        window.matchMedia = createMatchMedia(1024);
        const dataStreams = [
            {
                dsi_id: 1,
                dsi_pid: 'UQ:252236',
                dsi_dsid: 'test.mp4',
                dsi_embargo_date: '2018-01-01',
                dsi_open_access: 1,
                dsi_label: 'UPO Guide v.4',
                dsi_mimetype: 'video/mp4',
                dsi_copyright: null,
                dsi_state: 'A',
                dsi_size: 587005,
                dsi_security_inherited: 1,
                dsi_security_policy: 1,
            },
            {
                dsi_id: 2,
                dsi_pid: 'UQ:252236',
                dsi_dsid: 'thumbnail_test.jpg',
                dsi_embargo_date: '2018-01-01',
                dsi_open_access: 1,
                dsi_label: 'UPO Guide v.4',
                dsi_mimetype: 'image/jpeg',
                dsi_copyright: null,
                dsi_state: 'A',
                dsi_size: 587005,
                dsi_security_inherited: 1,
                dsi_security_policy: 1,
            },
            {
                dsi_id: 3,
                dsi_pid: 'UQ:252236',
                dsi_dsid: 'preview_test.jpg',
                dsi_embargo_date: '2018-01-01',
                dsi_open_access: 1,
                dsi_label: 'UPO Guide v.4',
                dsi_mimetype: 'image/jpeg',
                dsi_copyright: null,
                dsi_state: 'A',
                dsi_size: 587005,
                dsi_security_inherited: 1,
                dsi_security_policy: 1,
            },
            {
                dsi_id: 4,
                dsi_pid: 'UQ:252236',
                dsi_dsid: 'web_test.jpg',
                dsi_embargo_date: '2018-01-01',
                dsi_open_access: 1,
                dsi_label: 'UPO Guide v.4',
                dsi_mimetype: '',
                dsi_copyright: null,
                dsi_state: 'A',
                dsi_size: 587005,
                dsi_security_inherited: 1,
                dsi_security_policy: 1,
            },
            {
                dsi_id: 5,
                dsi_pid: 'UQ:252236',
                dsi_dsid: 'test_xt.mp4',
                dsi_embargo_date: '2018-01-01',
                dsi_open_access: 1,
                dsi_label: 'UPO Guide v.4',
                dsi_mimetype: 'video/mp4',
                dsi_copyright: null,
                dsi_state: 'A',
                dsi_size: 0,
                dsi_security_inherited: 1,
                dsi_security_policy: 1,
            },
        ];
        Object.defineProperty(window.navigator, 'userAgent', { value: 'FireFox' });
        useRecordContext.mockImplementation(() => ({
            record: {
                ...recordWithDatastreams,
                fez_datastream_info: dataStreams,
                fez_record_search_key_license: {
                    // make sure previews works even when the record's files are license restricted
                    rek_license: CURRENT_LICENCES[0].value,
                },
            },
        }));
        const userIsAdmin = jest.spyOn(UserIsAdminHook, 'userIsAdmin');
        userIsAdmin.mockImplementation(() => true);
        const onDateChangeFn = jest.fn();
        const { getByTestId, queryByTestId, getByText } = setup({
            canEdit: true,
            dataStreams: dataStreams,
            onDateChange: onDateChangeFn,
        });

        expect(
            getByText('Please RIGHT CLICK then select link SAVE AS option to save and play video files'),
        ).toBeInTheDocument();

        // fireEvent.click(getByTitle('Click to open a preview of http://localhost/view/UQ:252236/test.mp4'));
        fireEvent.click(getByTestId('preview-link-test.mp4'));

        fireEvent.click(within(getByTestId('media-preview')).getByRole('button', { name: 'Close' }));
        await waitFor(() => expect(queryByTestId('media-preview')).not.toBeInTheDocument());

        fireEvent.click(getByTestId('file-name-1-preview'));
        fireEvent.click(within(getByTestId('media-preview')).getByRole('button', { name: 'Close' }));
        await waitFor(() => expect(queryByTestId('media-preview')).not.toBeInTheDocument());
    });

    it('should have helper to get the open access status of a file', () => {
        const testDate = '2040-09-09';
        const openAccessStatusId = openAccessConfig.OPEN_ACCESS_ID_FILE_PUBLISHER_VERSION;
        const expected1 = {
            isOpenAccess: false,
            embargoDate: testDate,
            openAccessStatusId,
            securityStatus: true,
        };
        const expected2 = {
            isOpenAccess: true,
            embargoDate: null,
            openAccessStatusId,
        };
        expect(getFileOpenAccessStatus(openAccessStatusId, { dsi_embargo_date: testDate })).toEqual(expected1);
        expect(getFileOpenAccessStatus(openAccessStatusId, { dsi_embargo_date: '1920-09-09' })).toEqual(expected2);
    });

    describe('Attached file renaming', () => {
        it('should check calls to rename fire expected function calls', async () => {
            const userIsAdmin = jest.spyOn(UserIsAdminHook, 'userIsAdmin');
            userIsAdmin.mockImplementation(() => true);
            const originalFilename = 'My_UQ_eSpace_UPO_guidelines_2016.pdf';
            const badNewFilename = 'renamed.pdf';
            const goodNewFilename = 'renamed';
            const dataStreams = [
                {
                    dsi_id: 0,
                    dsi_pid: 'UQ:252236',
                    dsi_dsid: originalFilename,
                    dsi_embargo_date: '2018-01-01',
                    dsi_open_access: 1,
                    dsi_label: 'UPO Guide v.4',
                    dsi_mimetype: 'application/pdf',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 587005,
                    dsi_security_inherited: 1,
                    dsi_security_policy: 1,
                },
            ];
            const dataStreamsRenamed = [
                {
                    dsi_id: 0,
                    dsi_pid: 'UQ:252236',
                    dsi_dsid: `${goodNewFilename}.pdf`,
                    dsi_dsid_new: originalFilename,
                    dsi_embargo_date: '2018-01-01',
                    dsi_open_access: 1,
                    dsi_label: 'UPO Guide v.4',
                    dsi_mimetype: 'application/pdf',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 587005,
                    dsi_security_inherited: 1,
                    dsi_security_policy: 1,
                    dsi_order: null,
                },
            ];

            const onFilenameSave = jest.fn();
            const onFilenameChange = jest.fn();

            const { rerender, getByTestId, queryByTestId } = setup({
                canEdit: true,
                dataStreams,
                onFilenameSave,
            });

            expect(getByTestId('file-name-0-edit')).toBeInTheDocument();
            act(() => {
                fireEvent.click(getByTestId('file-name-0-edit'));
            });
            await waitFor(() => expect(queryByTestId('file-name-0-editing-input')).toBeInTheDocument());

            expect(getByTestId('file-name-0-cancel')).toBeInTheDocument(); // cancel btn
            expect(getByTestId('file-name-0-save')).toBeInTheDocument(); // save btn

            act(() => {
                fireEvent.click(getByTestId('file-name-0-cancel'));
            });

            await waitFor(() => expect(getByTestId('file-name-0-edit')).toBeInTheDocument());

            act(() => {
                fireEvent.click(getByTestId('file-name-0-edit'));
            });
            await waitFor(() => expect(queryByTestId('file-name-0-editing-input')).toBeInTheDocument());

            fireEvent.change(getByTestId('file-name-0-editing-input'), { target: { value: badNewFilename } });

            act(() => {
                fireEvent.click(getByTestId('file-name-0-save'));
            });

            // bad filename shouldnt call the save method
            expect(onFilenameSave).not.toHaveBeenCalled();

            fireEvent.change(getByTestId('file-name-0-editing-input'), { target: { value: goodNewFilename } });

            act(() => {
                fireEvent.click(getByTestId('file-name-0-save'));
            });

            expect(onFilenameSave).toHaveBeenCalledWith(
                [
                    { key: 'dsi_dsid_new', value: originalFilename },
                    { key: 'dsi_dsid', value: `${goodNewFilename}.pdf` },
                ],
                null,
                0,
            );

            setup(
                {
                    canEdit: true,
                    dataStreams: dataStreamsRenamed,
                    onFilenameSave,
                    onFilenameChange,
                },
                rerender,
            );

            await waitFor(() => expect(queryByTestId('file-name-0-reset')).toBeInTheDocument());

            act(() => {
                fireEvent.click(getByTestId('file-name-0-reset'));
            });

            expect(onFilenameChange).toHaveBeenCalledWith('dsi_dsid', originalFilename, 0, badNewFilename);

            // code coverage
            await waitFor(() => expect(queryByTestId('file-name-0-edit')).toBeInTheDocument());

            act(() => {
                fireEvent.click(getByTestId('file-name-0-edit'));
            });
            await waitFor(() => expect(queryByTestId('file-name-0-editing-input')).toBeInTheDocument());

            fireEvent.change(getByTestId('file-name-0-editing-input'), { target: { value: 'test.pdf.invalid' } });

            act(() => {
                fireEvent.click(getByTestId('file-name-0-save'));
            });

            // state of buttons doesnt change for invalid entries
            expect(getByTestId('file-name-0-editing-input')).toBeInTheDocument();
            expect(queryByTestId('file-name-0-edit')).not.toBeInTheDocument();
        });
    });
    describe('helper functions', () => {
        const getErrorMessageFormatted = file =>
            fileUploadLocale.default.validation.sameFileNameWithDifferentExt.replace('[fileNames]', file);
        it('checkFileNamesForDupes should check for duplicate filenames after rename', () => {
            const setErrorMessage = jest.fn();
            const dataStreams = [
                {
                    dsi_dsid: 'file1.jpg',
                },
                {
                    dsi_dsid: 'file2_renamed.jpg',
                    dsi_dsid_new: 'file2.jpg',
                },
            ];
            const formValuesFromContext = [];
            const excludeIndex = 1;
            const callback = checkFileNamesForDupes(dataStreams, formValuesFromContext, setErrorMessage, excludeIndex);
            const expectedErrorMessage = getErrorMessageFormatted('file1.jpg');
            expect(callback('file1.jpg')).toEqual(false);
            expect(setErrorMessage).toHaveBeenCalledWith(expectedErrorMessage);
            expect(callback('file_new.jpg')).toEqual(true);
        });
        it('checkFileNamesForDupes should check for duplicate filenames with different extensions after rename', () => {
            const setErrorMessage = jest.fn();
            const dataStreams = [
                {
                    dsi_dsid: 'file1.pdf',
                },
                {
                    dsi_dsid: 'file2_renamed.jpg',
                    dsi_dsid_new: 'file2.jpg',
                },
            ];
            const formValuesFromContext = [];
            const excludeIndex = 1;
            const callback = checkFileNamesForDupes(dataStreams, formValuesFromContext, setErrorMessage, excludeIndex);
            const expectedErrorMessage = getErrorMessageFormatted('file1.jpg');
            expect(callback('file1.jpg')).toEqual(false); // test file names with different extensions are captured
            expect(setErrorMessage).toHaveBeenCalledWith(expectedErrorMessage);
            expect(callback('file_new.jpg')).toEqual(true);
        });
        it('checkFileNamesForDupes should check for duplicate filenames after already renamed', () => {
            const setErrorMessage = jest.fn();
            const dataStreams = [
                {
                    dsi_dsid: 'file1.jpg',
                },
                {
                    dsi_dsid: 'file2_renamed.jpg',
                    dsi_dsid_new: 'file2.jpg',
                },
            ];
            const formValuesFromContext = [];
            const excludeIndex = 0;
            const callback = checkFileNamesForDupes(dataStreams, formValuesFromContext, setErrorMessage, excludeIndex);
            const expectedErrorMessage = getErrorMessageFormatted('file2_renamed.jpg');
            expect(callback('file2_renamed.jpg')).toEqual(false);
            expect(setErrorMessage).toHaveBeenCalledWith(expectedErrorMessage);
            expect(callback('file2.jpg')).toEqual(false);
            expect(callback('file_new.jpg')).toEqual(true);
        });
        it('checkFileNamesForDupes should check for duplicate filenames with new file attached and before rename', () => {
            const setErrorMessage = jest.fn();
            const dataStreams = [
                {
                    dsi_dsid: 'file1.jpg',
                },
                {
                    dsi_dsid: 'file2_renamed.jpg',
                    dsi_dsid_new: 'file2.jpg',
                },
            ];
            const formValuesFromContext = { files: { queue: [{ name: 'attached.jpg' }] } };
            const excludeIndex = 1;
            const callback = checkFileNamesForDupes(dataStreams, formValuesFromContext, setErrorMessage, excludeIndex);
            const expectedErrorMessage = getErrorMessageFormatted('attached.jpg');
            expect(callback('attached.jpg')).toEqual(false);
            expect(setErrorMessage).toHaveBeenCalledWith(expectedErrorMessage);
            expect(callback('file_new.jpg')).toEqual(true);
        });

        it('checkFileNamesForDupes should check for duplicate filenames with new file attached and after rename', () => {
            const setErrorMessage = jest.fn();
            const dataStreams = [
                {
                    dsi_dsid: 'file1.jpg',
                },
                {
                    dsi_dsid: 'attached.jpg',
                    dsi_dsid_new: 'file2.jpg',
                },
            ];
            const formValuesFromContext = { files: { queue: [{ name: 'attached.jpg' }] } };
            const excludeIndex = 0;
            const callback = checkFileNamesForDupes(dataStreams, formValuesFromContext, setErrorMessage, excludeIndex);
            const expectedErrorMessage = getErrorMessageFormatted('attached.jpg');
            expect(callback('attached.jpg')).toEqual(false);
            expect(setErrorMessage).toHaveBeenCalledWith(expectedErrorMessage);
        });
    });
});
