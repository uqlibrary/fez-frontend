import React from 'react';
import MemoizedAdminContainer, { AdminContainer, isSame } from './AdminContainer';
import { recordWithDatastreams } from 'mock/data';
import Immutable from 'immutable';

jest.mock('@material-ui/core/useMediaQuery');
import useMediaQuery from '@material-ui/core/useMediaQuery';

jest.mock('js-cookie');
jest.mock('../submitHandler', () => ({
    onSubmit: jest.fn(),
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

function setup(testProps = {}, args = { isShallow: true }) {
    const props = {
        authorDetails: {
            username: 'uqstaff',
        },
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
        loadRecordToView: jest.fn(),
        loadingRecordToView: false,
        recordToView: recordWithDatastreams,
        location: {
            search: '',
        },
        handleSubmit: jest.fn(),
        ...testProps,
    };

    return getElement(AdminContainer, props, args);
}

describe('AdminContainer component', () => {
    it('should render default view', () => {
        const wrapper = setup({});

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render mobile view', () => {
        Cookies.mockImplementation(() => ({
            get: jest.fn(() => 'tabbed'),
        }));
        useMediaQuery.mockImplementation(() => true);
        const wrapper = setup({});

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render loading record view', () => {
        const wrapper = setup({
            loadingRecordToView: true,
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render record not found view', () => {
        const wrapper = setup({
            recordToView: null,
            loadingRecordToView: false,
            isDeleted: true,
            recordToViewError: { message: 'test', status: 404 },
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with tabbed interface', () => {
        Cookies.mockImplementation(() => ({ get: jest.fn(() => 'tabbed') }));

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

    it('should render when form errors are present as immutable map', () => {
        const wrapper = setup({
            formErrors: Immutable.Map({
                bibliographicSection: {
                    rek_date: 'Publication date is required',
                    rek_title: 'Title is required',
                },
            }),
        });

        expect(wrapper.find('Memo(AdminInterface)').props().tabs.bibliographic.numberOfErrors).toBe(2);
    });

    it('should render with an empty record', () => {
        const wrapper = setup({
            loadingRecordToView: false,
            recordToView: {
                ...recordWithDatastreams,
                rek_object_type_lookup: null,
            },
            match: {
                params: {
                    pid: 'UQ:123456',
                },
            },
        });
        expect(wrapper.find('Memo(AdminInterface)').props().tabs.identifiers.activated).toBe(false);
    });

    it('should show Add form', () => {
        const wrapper = setup({
            createMode: true,
            match: {
                params: {},
            },
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
            authorDetails: {
                username: 'uqstaff',
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
        const scrollIntoViewMock = jest.fn();
        window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;
        Cookies.get = jest.fn(() => 'tabbed');
        const wrapper = setup({}, { isShallow: false });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should not render non-security errors for community editing', () => {
        const wrapper = setup({
            recordToView: {
                rek_pid: 'UQ:367646',
                rek_title: 'View across Windsor Castle',
                rek_description: 'Henry William Mobsby was born on 17 August 1860',
                rek_display_type: 11,
                rek_display_type_lookup: 'Community',
            },
            formErrors: Immutable.Map({
                bibliographicSection: {
                    rek_date: 'Publication date is required',
                    rek_title: 'Title is required',
                },
                securitySection: {
                    rek_security_policy: 'Policy is required',
                },
            }),
        });

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    describe('isSame callback function', () => {
        it('should return true if props are not changed', () => {
            expect(
                isSame(
                    { disableSubmit: false, recordToView: { pid: 1 }, loadRecordToView: false },
                    { disableSubmit: false, recordToView: { pid: 1 }, loadRecordToView: false },
                ),
            ).toBeTruthy();
        });

        it('should return true if props are not changed', () => {
            expect(
                isSame(
                    { disableSubmit: false, loadRecordToView: false },
                    { disableSubmit: false, loadRecordToView: false },
                ),
            ).toBeTruthy();
        });
    });

    describe('React hooks', () => {
        it('should call clearRecordToView() prop on unload', () => {
            const mockUseEffect = jest.spyOn(React, 'useEffect');
            const mockUseCallback = jest.spyOn(React, 'useCallback');
            const cleanupFns = [];

            mockUseEffect.mockImplementation(f => {
                const hookReturn = f();
                if (typeof hookReturn === 'function') {
                    cleanupFns.push(hookReturn);
                }
            });

            // mock once each for each instance of useCallback
            mockUseCallback.mockImplementationOnce(f => f()).mockImplementationOnce(f => f());

            const clearRecordToView = jest.fn();
            setup({
                clearRecordToView,
            });

            while (cleanupFns.length > 0) {
                cleanupFns.pop()();
            }

            mockUseEffect.mockRestore();
            mockUseCallback.mockRestore();

            expect(clearRecordToView).toHaveBeenCalled();
        });
    });
});
