import { act } from 'test-utils';
import { AttachedFiles, formatBytes, getFileData, getFileOpenAccessStatus, untranscodedItem } from './AttachedFiles';
import { recordWithDatastreams } from 'mock/data';

jest.mock('../../../../context');
import { useAccountContext, useRecordContext } from 'context';

jest.mock('@material-ui/styles', () => ({
    makeStyles: () => () => ({}),
}));

function setup(testProps = {}, args = { isShallow: true }) {
    const props = {
        dataStreams: recordWithDatastreams.fez_datastream_info,
        locale: {
            title: 'Files',
        },
        ...testProps,
    };

    return getElement(AttachedFiles, props, args);
}

describe('AttachedFiles component', () => {
    beforeEach(() => {
        useRecordContext.mockImplementation(() => ({
            record: {
                ...recordWithDatastreams,
                fez_datastream_info: [],
            },
        }));
        useAccountContext.mockImplementation(() => ({
            account: {},
        }));
    });

    afterEach(() => {
        useAccountContext.mockReset();
        useRecordContext.mockReset();
    });

    it('should render default view', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render with no datastreams', () => {
        const wrapper = setup({
            dataStreams: [],
        });
        expect(wrapper).toEqual({});
    });

    it('should render admin edit view', () => {
        useAccountContext.mockImplementation(() => ({
            account: {
                is_administrator: true,
            },
        }));
        const testFn1 = jest.fn();
        const testFn2 = jest.fn();
        const testFn3 = jest.fn();
        const testProps = {
            dataStreams: [
                {
                    ...recordWithDatastreams.fez_datastream_info[0],
                    dsi_dsid: 'test.txt', // override blacklisted filename
                    dsi_embargo_date: '3000-10-20',
                },
            ],
            canEdit: true,
            onDateChange: testFn1,
            onDescriptionChange: testFn2,
            onDelete: testFn3,
        };
        const wrapper = setup(testProps);

        expect(toJson(wrapper)).toMatchSnapshot();

        act(() => {
            wrapper
                .find('WithStyles(FileUploadEmbargoDate)')
                .props()
                .onChange();
        });
        wrapper.update();
        expect(testFn1).toHaveBeenCalledTimes(1);

        act(() => {
            wrapper
                .find('WithStyles(TextFieldWrapper)')
                .props()
                .onChange({
                    target: {
                        value: 'test',
                    },
                });
        });
        wrapper.update();
        expect(testFn2).toHaveBeenCalledTimes(1);
        expect(testFn2).toHaveBeenCalledWith('dsi_label', 'test', 0);

        act(() => {
            wrapper
                .find('WithStyles(IconButton)')
                .props()
                .onClick();
        });
        wrapper.update();
        expect(testFn3).toHaveBeenCalledTimes(1);
    });

    it('should show alerts', () => {
        Object.defineProperty(window.navigator, 'userAgent', { value: 'FireFox' });
        useRecordContext.mockImplementation(() => ({
            record: {
                ...recordWithDatastreams,
                fez_datastream_info: [],
                fez_record_search_key_advisory_statement: {
                    rek_advisory_statement: '',
                },
            },
        }));
        const testProps = {
            dataStreams: [
                {
                    ...recordWithDatastreams.fez_datastream_info.slice(0, 1)[0],
                    dsi_dsid: 'test.mp4',
                    dsi_mimetype: 'video/mp4',
                },
            ],
            locale: {
                culturalSensitivityStatement: 'test advisory',
            },
        };
        const wrapper = setup(testProps);
        expect(toJson(wrapper.find('WithStyles(Alert)'))).toMatchSnapshot();
    });

    fit('should toggle preview', () => {
        const testProps = {
            dataStreams: [
                {
                    ...recordWithDatastreams.fez_datastream_info[0],
                    dsi_dsid: 'test.mp4',
                    dsi_mimetype: 'video/mp4',
                },
                {
                    ...recordWithDatastreams.fez_datastream_info[0],
                    dsi_dsid: 'thumbnail_test_t.jpg',
                },
            ],
            locale: {
                culturalSensitivityStatement: 'test advisory',
            },
        };
        const wrapper = setup(testProps);
        console.log(wrapper);

        act(() => {
            wrapper
                .find('FileIcon')
                .props()
                .showPreview({
                    mediaUrl: 'test1',
                    mimeType: 'test2',
                    fileName: 'test3',
                    previewMediaUrl: 'test4',
                });
        });
        wrapper.update();
        expect(toJson(wrapper.find('MediaPreview'))).toMatchSnapshot();

        act(() => {
            wrapper
                .find('MediaPreview')
                .props()
                .onClose();
        });
        wrapper.update();
        expect(wrapper.find('MediaPreview').length).toBe(0);
    });
});

describe('formatBytes helper', () => {
    it('should return "0 Bytes" when 0 is given', () => {
        expect(formatBytes(0)).toBe('0 Bytes');
    });
});

describe('getFileOpenAccessStatus helper', () => {
    it('should indicate non-OA status when applicable', () => {
        const publication = {
            fez_record_search_key_oa_status: {
                rek_oa_status: false,
            },
        };
        expect(getFileOpenAccessStatus(publication, {})).toEqual({
            isOpenAccess: false,
            embargoDate: null,
            openAccessStatusId: null,
        });
    });
});

describe('untranscodedItem helper', () => {
    it('should remove "_xt" and file extension from a given filename', () => {
        expect(untranscodedItem('test_xt.txt')).toBe('test');
    });
});

describe('getFileData helper', () => {
    const publication = {};
    const isAdmin = false;
    const isAuthor = false;
    it('should set mimetype to empty string if dsi_mimetype is not set', () => {
        const dataStreams = [{ dsi_dsid: 'test.txt', dsi_state: 'A' }];
        expect(getFileData(publication, dataStreams, isAdmin, isAuthor)[0].mimeType).toBe('');
    });

    it('should generate preview and web media URLs when applicable', () => {
        const dataStreams = [
            { dsi_pid: 'UQ:123456', dsi_dsid: 'test.mp4', dsi_state: 'A' },
            { dsi_pid: 'UQ:123456', dsi_dsid: 'preview_test.jpg', dsi_state: 'A' },
            { dsi_pid: 'UQ:123456', dsi_dsid: 'web_test.jpg', dsi_state: 'A' },
        ];
        const testResult = getFileData(publication, dataStreams, isAdmin, isAuthor);
        expect(testResult[0].previewMediaUrl).toBe('http://localhost/view/UQ:123456/preview_test.jpg');
        expect(testResult[0].webMediaUrl).toBe('http://localhost/view/UQ:123456/web_test.jpg');
    });
});
