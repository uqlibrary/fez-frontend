import { latestPubsPayload } from 'mock/data/testing/latestPublications';
import { MyLatestPublications, styles } from './MyLatestPublications';

function setup(testProps = {}) {
    const props = {
        history: {},
        actions: {
            searchLatestPublications: jest.fn(),
        },
        classes: { blueButton: 'blueButton' },
        ...testProps,
    };
    return getElement(MyLatestPublications, props);
}

describe('Component MyLatestPublications', () => {
    it('should render latest publications', () => {
        const wrapper = setup({
            latestPublicationsList: latestPubsPayload.data,
            totalPublicationsCount: latestPubsPayload.total,
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render loading indicator', () => {
        const wrapper = setup({ loadingLatestPublications: true });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should fetch data if account author details is loaded', () => {
        const testFn = jest.fn();
        setup({ accountAuthorDetailsLoading: false, actions: { searchLatestPublications: testFn } });
        expect(testFn).toHaveBeenCalled();
    });

    it('should not fetch data if account author details is still loading', () => {
        const testFn = jest.fn();
        setup({ accountAuthorDetailsLoading: true, actions: { searchLatestPublications: testFn } });
        expect(testFn).not.toBeCalled();
    });

    it('_viewMyResearch method', () => {
        const testFn = jest.fn();
        const wrapper = setup({ history: { push: testFn } });
        wrapper.instance()._viewMyResearch();
        expect(testFn).toHaveBeenCalledWith('/records/mine');
    });

    it('should have a proper style generator', () => {
        const theme = {
            palette: {
                accent: {
                    main: 'test1',
                    dark: 'test2',
                },
                white: {
                    main: 'test3',
                },
            },
        };
        expect(styles(theme)).toMatchSnapshot();
    });
});
