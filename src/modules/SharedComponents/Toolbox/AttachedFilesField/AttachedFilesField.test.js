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

function setup(testProps = {}, args = { isShallow: true }) {
    const props = {
        input: {},
        ...testProps,
    };

    return getElement(AttachedFilesField, props, args);
}

describe('AttachedFilesField component', () => {
    it('should render default view', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render with initial data', () => {
        const wrapper = setup({
            meta: {
                initial: Immutable.List(recordWithDatastreams.fez_datastream_info.slice(0, 1)),
            },
        });
        expect(toJson(wrapper)).toMatchSnapshot();
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
        // it('Change handler', () => {
        //     const dataStreams = [1, 2, 3];
        //     const onChange = jest.fn();
        //     handleOnChange(dataStreams, onChange);
        //     expect(onChange).toHaveBeenCalledWith(dataStreams);
        // });
        it('DatastreamChange handler', () => {
            const dataStreams = [{ test1: 'test a' }, { test1: 'test b' }, { test1: 'test c' }];
            const setDataStreams = jest.fn();
            const callback = handleDatastreamChange(dataStreams, setDataStreams);
            callback('test2', 'test b2', 1);
            expect(setDataStreams).toHaveBeenCalledWith([
                { test1: 'test a' },
                { test1: 'test b', test2: 'test b2' },
                { test1: 'test c' },
            ]);
        });
        it('DatastreamMultiChange handler', () => {
            const dataStreams = [{ dsi_dsid: 'test a' }, { dsi_dsid: 'test b' }, { dsi_dsid: 'test c' }];
            const setDataStreams = jest.fn();
            const callback = handleDatastreamMultiChange(dataStreams, setDataStreams);
            callback(
                [
                    { key: 'dsi_dsid_new', value: 'test b' },
                    { key: 'dsi_dsid', value: 'new test b' },
                ],
                1,
            );
            expect(setDataStreams).toHaveBeenCalledWith([
                { dsi_dsid: 'test a' },
                { dsi_dsid: 'new test b', dsi_dsid_new: 'test b' },
                { dsi_dsid: 'test c' },
            ]);
        });
    });
});
