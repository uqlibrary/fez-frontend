import React from 'react';
import AttachedFiles from './AttachedFiles';
import { recordWithDatastreams } from 'mock/data';
import { rtlRender, fireEvent, waitFor, act } from 'test-utils';

import mediaQuery from 'css-mediaquery';

function createMatchMedia(width) {
    return query => ({
        matches: mediaQuery.match(query, { width }),
        addListener: () => {},
        removeListener: () => {},
    });
}

jest.mock('hooks');
import { userIsAdmin } from 'hooks';

jest.mock('context');
import { useRecordContext } from 'context';

function setup(testProps = {}, renderer = rtlRender) {
    const props = {
        dataStreams: recordWithDatastreams.fez_datastream_info,
        locale: {
            title: 'Files',
        },
        ...testProps,
    };

    return renderer(<AttachedFiles {...props} />);
}

describe('AttachedFiles component', () => {
    beforeEach(() => {
        window.matchMedia = createMatchMedia(window.innerWidth);

        useRecordContext.mockImplementation(() => ({
            record: recordWithDatastreams,
        }));
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
        expect(queryByText('presmd_MyUQeSpaceResearcherGuidelines.xml')).not.toBeInTheDocument();
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
        userIsAdmin.mockImplementation(() => true);
        const { getByText } = setup({ canEdit: true });
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
        expect(getByText('presmd_MyUQeSpaceResearcherGuidelines.xml')).toBeInTheDocument();
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
        userIsAdmin.mockImplementation(() => true);
        const onDeleteFn = jest.fn();
        const onDescriptionChangeFn = jest.fn();
        const { getByTestId } = setup({
            canEdit: true,
            onDelete: onDeleteFn,
            onDescriptionChange: onDescriptionChangeFn,
        });

        fireEvent.click(getByTestId('delete-file-3'));
        expect(onDeleteFn).toHaveBeenCalledWith(3);

        fireEvent.change(getByTestId('dsi-label-2-input'), { target: { value: 'test file description' } });
        expect(onDescriptionChangeFn).toHaveBeenCalledWith('dsi_label', 'test file description', 2);
    });

    it('should render embargo date field for open access file with embargo date in future', async () => {
        userIsAdmin.mockImplementation(() => true);
        useRecordContext.mockImplementation(() => ({
            record: { fez_record_search_key_oa_status: { rek_oa_status: 453695 } },
        }));
        const onDateChangeFn = jest.fn();
        const { getByText, getAllByRole } = setup({
            canEdit: true,
            dataStreams: [
                {
                    dsi_pid: 'UQ:252236',
                    dsi_dsid: 'My_UQ_eSpace_UPO_guidelines_2016.pdf',
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
            ],
            onDateChange: onDateChangeFn,
        });

        act(() => {
            fireEvent.click(getAllByRole('button')[0]);
        });
        const calendar = await waitFor(() => getAllByRole('presentation')[0]);

        fireEvent.click(getByText('28', calendar));
        expect(onDateChangeFn).toHaveBeenCalledWith('dsi_embargo_date', '2018-01-28', 0);
    });

    it('should show alert for advisory statement', () => {
        userIsAdmin.mockImplementation(() => true);
        useRecordContext.mockImplementation(() => ({
            record: { fez_record_search_key_advisory_statement: { rek_advisory_statement: 'test advisory statement' } },
        }));

        const { getByText } = setup({
            canEdit: true,
            hideCulturalSensitivityStatement: false,
            locale: {
                culturalSensitivityStatement: 'test advisory',
            },
        });

        expect(getByText('test advisory statement')).toBeInTheDocument();
    });

    it('should show alert for advisory statement from locale', () => {
        userIsAdmin.mockImplementation(() => true);
        useRecordContext.mockImplementation(() => ({
            record: { fez_record_search_key_advisory_statement: { rek_advisory_statement: null } },
        }));

        const { getByText } = setup({
            canEdit: true,
            hideCulturalSensitivityStatement: false,
            locale: {
                culturalSensitivityStatement: 'test advisory',
            },
        });

        expect(getByText('test advisory')).toBeInTheDocument();
    });

    it('should toggle preview', async done => {
        Object.defineProperty(window.navigator, 'userAgent', { value: 'FireFox' });
        userIsAdmin.mockImplementation(() => true);
        const onDateChangeFn = jest.fn();
        const { getByTitle, getByTestId, queryByTestId, getByText } = setup({
            canEdit: true,
            dataStreams: [
                {
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
            ],
            onDateChange: onDateChangeFn,
        });

        expect(
            getByText('Please RIGHT CLICK then select link SAVE AS option to save and play video files'),
        ).toBeInTheDocument();

        act(() => {
            fireEvent.click(getByTitle('Click to open a preview of http://localhost/view/UQ:252236/test.mp4'));
        });

        const previewEl = await waitFor(() => expect(getByTestId('media-preview')).toBeInTheDocument());

        act(() => {
            fireEvent.click(getByTestId('close-preview', previewEl));
        });

        await waitFor(() => expect(queryByTestId('media-preview')).not.toBeInTheDocument());

        done();
    });
});
