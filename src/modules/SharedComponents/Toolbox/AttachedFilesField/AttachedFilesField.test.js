import React from 'react';
import { rtlRender, WithReduxStore, FormProviderWrapper } from 'test-utils';
import {
    AttachedFilesField,
    deleteCallbackFactory,
    handleDatastreamChange,
    handleDatastreamMultiChange,
} from './AttachedFilesField';

jest.mock('context');
import { useRecordContext } from 'context';

function setup({ values, ...testProps }) {
    const props = {
        onRenameAttachedFile: jest.fn(),
        onDeleteAttachedFile: jest.fn(),
        ...testProps,
    };

    return rtlRender(
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

const newDs = [
    {
        dsi_av_check_date: null,
        dsi_av_check_state: null,
        dsi_checksum: '90e3f7efe37a4892241260f5c5fff938',
        dsi_copyright: null,
        dsi_dsid: 'new_file.jpeg',
        dsi_embargo_date: '2025-01-31',
        dsi_id: 3835508,
        dsi_label: 'new file test description',
        dsi_mimetype: 'image/jpeg',
        dsi_open_access: null,
        dsi_order: 1,
        dsi_pid: 'UQ:342708',
        dsi_security_inherited: 0,
        dsi_security_policy: 5,
        dsi_size: 223390,
        dsi_state: 'A',
    },
];

describe('AttachedFilesField component', () => {
    beforeAll(() => {
        useRecordContext.mockImplementation(() => ({
            record: {},
        }));
    });

    it('should render nothing when no files provided', () => {
        const { container } = setup({});
        expect(container).toMatchSnapshot();
    });

    it('should render default view when files provided', () => {
        const { container } = setup({
            values: {
                fez_datastream_info: newDs,
            },
        });
        expect(container).toMatchSnapshot();
    });

    it('should render with initial data', () => {
        const { container } = setup({
            values: {
                fez_datastream_info: undefined,
            },
            state: {
                defaultValue: newDs,
            },
        });
        expect(container).toMatchSnapshot();
    });

    describe('AttachedFilesField callback factories', () => {
        it('should create delete callback', () => {
            const dataStreams = [1, 2, 3];
            const onChangeFn = jest.fn();
            const onDeleteAttachedFile = jest.fn();
            const callback = deleteCallbackFactory(dataStreams, onDeleteAttachedFile, onChangeFn)[0];
            callback(1);
            expect(onChangeFn).toHaveBeenCalledWith([1, 2, 1, 2, 3]);
        });
    });

    describe('handler functions', () => {
        it('DatastreamChange handler', () => {
            const dataStreams = [{ test1: 'test a' }, { test1: 'test b' }, { test1: 'test c' }];
            const setDataStreams = jest.fn();
            const onRenameAttachedFile = jest.fn();
            const callback = handleDatastreamChange(dataStreams, setDataStreams, onRenameAttachedFile);
            callback('test2', 'test b2', 1, 'test b');
            expect(setDataStreams).toHaveBeenCalledWith([
                { test1: 'test a' },
                { test1: 'test b', test2: 'test b2' },
                { test1: 'test c' },
            ]);
            expect(onRenameAttachedFile).toHaveBeenCalledWith('test b', 'test b2');
        });
        it('DatastreamMultiChange handler', () => {
            const dataStreams = [{ dsi_dsid: 'test a' }, { dsi_dsid: 'test b' }, { dsi_dsid: 'test c' }];
            const setDataStreams = jest.fn();
            const onRenameAttachedFile = jest.fn();
            const callback = handleDatastreamMultiChange(dataStreams, setDataStreams, onRenameAttachedFile);
            callback(
                [
                    { key: 'dsi_dsid_new', value: 'test b' },
                    { key: 'dsi_dsid', value: 'new test b' },
                ],
                null,
                1,
            );
            expect(setDataStreams).toHaveBeenCalledWith([
                { dsi_dsid: 'test a' },
                { dsi_dsid: 'new test b', dsi_dsid_new: 'test b' },
                { dsi_dsid: 'test c' },
            ]);
            expect(onRenameAttachedFile).toHaveBeenCalledWith('test b', 'new test b');
        });
    });
});
