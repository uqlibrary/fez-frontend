import MemoizedAdminContainer, { AdminContainer, isChanged } from './AdminContainer';
import { recordWithDatastreams } from 'mock/data';

jest.mock('js-cookie', () => ({
    get: jest.fn(),
    set: jest.fn(),
}));
import Cookies from 'js-cookie';

jest.mock('redux-form/immutable');

jest.mock('@material-ui/styles/useTheme', () => () => ({
    breakpoints: {
        down() {
            return false;
        },
    },
}));

jest.mock('@material-ui/core/useMediaQuery');
import { unstable_useMediaQuery as useMediaQuery } from '@material-ui/core/useMediaQuery';

function setup(testProps = {}, args = { isShallow: true }) {
    const props = {
        classes: {
            helpIcon: 'helpicon',
            tabIndicator: 'tabindicator',
            badgeMargin: 'badgemargin',
        },
        match: {
            params: {
                pid: 'UQ:111111',
            },
        },
        actions: {
            loadRecordToView: jest.fn(),
        },
        loadingRecordToView: false,
        recordToView: recordWithDatastreams,
        location: {
            search: '',
        },
        ...testProps,
    };

    return getElement(AdminContainer, props, args);
}

describe('AdminContainer component', () => {
    it('should render default view', () => {
        const wrapper = setup({});

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render loading record view', () => {
        const wrapper = setup({
            loadingRecordToView: true,
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with tabbed interface', () => {
        Cookies.get = jest.fn(() => 'tabbed');

        useMediaQuery.mockImplementation(() => ({
            unstable_useMediaQuery: jest.fn(() => true),
        }));

        const wrapper = setup({
            loadingRecordToView: false,
            recordToView: null,
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render empty div if record is not loaded', () => {
        const wrapper = setup({
            loadingRecordToView: false,
            recordToView: null,
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render memoized component with styles', () => {
        const wrapper = getElement(MemoizedAdminContainer, {
            classes: {
                helpIcon: 'helpicon',
                tabIndicator: 'tabindicator',
                badgeMargin: 'badgemargin',
            },
            match: {
                params: {
                    pid: 'UQ:111111',
                },
            },
            actions: {
                loadRecordToView: jest.fn(),
            },
            loadingRecordToView: false,
            recordToView: recordWithDatastreams,
            location: {
                search: '',
            },
        });

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should full mount the component', () => {
        Cookies.get = jest.fn(() => 'tabbed');
        const wrapper = setup({}, { isShallow: false });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    describe('isChanged callback function', () => {
        it('should return true if props are not changed', () => {
            expect(
                isChanged(
                    { disableSubmit: false, recordToView: { pid: 1 }, loadRecordToView: false },
                    { disableSubmit: false, recordToView: { pid: 1 }, loadRecordToView: false },
                ),
            ).toBeTruthy();
        });

        it('should return true if props are not changed', () => {
            expect(
                isChanged(
                    { disableSubmit: false, loadRecordToView: false },
                    { disableSubmit: false, loadRecordToView: false },
                ),
            ).toBeTruthy();
        });
    });
});
