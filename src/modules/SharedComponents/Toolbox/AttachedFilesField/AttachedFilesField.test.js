import {
    AttachedFilesField,
    deleteCallbackFactory,
    datastreamChangeCallbackFactory,
    datastreamOrderChangeCallbackFactory,
    onChangeCallbackFactory,
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

    it('should create datastream change callback', () => {
        const dataStreams = [{ test1: 'test a' }, { test1: 'test b' }, { test1: 'test c' }];
        const setDataStreams = jest.fn();
        const callback = datastreamChangeCallbackFactory(dataStreams, setDataStreams)[0];
        callback('test2', 'test b2', 1);
        expect(setDataStreams).toHaveBeenCalledWith([
            { test1: 'test a' },
            { test1: 'test b', test2: 'test b2' },
            { test1: 'test c' },
        ]);
    });

    it('should create onChange callback', () => {
        const dataStreams = [1, 2, 3];
        const onChange = jest.fn();
        const callback = onChangeCallbackFactory(dataStreams, onChange)[0];
        callback();
        expect(onChange).toHaveBeenCalledWith(dataStreams);
    });

    it('should create datastream order change callback', () => {
        const dataStreams = [
            { test1: 'test a', dsi_dsid: 'test_a', dsi_order: 1 },
            { test1: 'test b', dsi_dsid: 'test_b', dsi_order: 2 },
            { test1: 'test c', dsi_dsid: 'test_c' },
        ];
        const setDataStreams = jest.fn();
        const callback = datastreamOrderChangeCallbackFactory(dataStreams, setDataStreams)[0];
        callback('test_b', 2, 1);
        expect(setDataStreams).toHaveBeenCalledWith([
            { test1: 'test a', dsi_dsid: 'test_a', dsi_order: 2 },
            { test1: 'test b', dsi_dsid: 'test_b', dsi_order: 1 },
            { test1: 'test c', dsi_dsid: 'test_c', dsi_order: 3 },
        ]);
    });
});
