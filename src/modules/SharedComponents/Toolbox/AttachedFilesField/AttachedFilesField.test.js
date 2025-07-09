import {
    AttachedFilesField,
    deleteCallbackFactory,
    datastreamOrderChangeCallbackFactory,
    // handleOnChange,
    handleDatastreamChange,
    handleDatastreamMultiChange,
} from './AttachedFilesField';
import Immutable from 'immutable';

import { recordWithDatastreams } from 'mock/data';

function setup(testProps = {}) {
    const props = {
        input: {},
        ...testProps,
    };

    return renderComponent(AttachedFilesField, props);
}

describe('AttachedFilesField component', () => {
    it('should render default view', () => {
        const render = setup({});
        expect(render.getRenderOutput()).toMatchSnapshot();
    });

    it('should render with initial data', () => {
        const render = setup({
            meta: {
                initial: Immutable.List(recordWithDatastreams.fez_datastream_info.slice(0, 1)),
            },
        });
        expect(render.getRenderOutput()).toMatchSnapshot();
    });

    describe('AttachedFilesField callback factories', () => {
        it('should create delete callback', () => {
            const dataStreams = [1, 2, 3];
            const setDataStreams = jest.fn();
            const onDeleteAttachedFile = jest.fn();
            const callback = deleteCallbackFactory(dataStreams, setDataStreams, onDeleteAttachedFile)[0];
            callback(1);
            expect(setDataStreams).toHaveBeenCalledWith([1, 2, 1, 2, 3]);
        });

        it('should create datastream order change callback', () => {
            const dataStreams = [
                { test1: 'test a', dsi_id: 1, dsi_dsid: 'test_a', dsi_order: 1 },
                { test1: 'test b', dsi_id: 2, dsi_dsid: 'test_b', dsi_order: 2 },
                { test1: 'test c', dsi_id: 3, dsi_dsid: 'test_c' },
            ];
            const setDataStreams = jest.fn();
            const callback = datastreamOrderChangeCallbackFactory(dataStreams, setDataStreams)[0];
            callback(2, 2, 1);
            expect(setDataStreams).toHaveBeenCalledWith([
                { test1: 'test a', dsi_id: 1, dsi_dsid: 'test_a', dsi_order: 2 },
                { test1: 'test b', dsi_id: 2, dsi_dsid: 'test_b', dsi_order: 1 },
                { test1: 'test c', dsi_id: 3, dsi_dsid: 'test_c', dsi_order: 3 },
            ]);
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
