import { AdvancedSearchComponent, styles } from './AdvancedSearchComponent';
import moment from 'moment';

const getProps = (testProps = {}) => ({
    isLoading: false,
    yearFilter: {
        invalid: false,
    },
    className: 'advanced-search',
    classes: {},

    onAdvancedSearchRowChange: jest.fn(),
    onSearch: jest.fn(),
    updateYearRangeFilter: jest.fn(),
    ...testProps,
});

function setup(testProps = {}) {
    return getElement(AdvancedSearchComponent, getProps(testProps));
}

describe('AdvancedSearchComponent', () => {
    it('should render default view', () => {
        const wrapper = setup();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should have a proper style generator', () => {
        const theme = {
            breakpoints: {
                up: jest.fn(() => 'test1'),
            },
            palette: {
                accent: {
                    main: 'test2',
                    dark: 'test3',
                },
                white: {
                    main: 'test4',
                },
            },
        };
        expect(styles(theme)).toMatchSnapshot();

        delete theme.palette.accent;
        delete theme.palette.white;
        expect(styles(theme)).toMatchSnapshot();

        delete theme.palette;
        expect(styles(theme)).toMatchSnapshot();
    });

    it('should have default event handler props return undefined', () => {
        const wrapper = setup();
        const defaultPropMethodNames = [
            'onToggleSearchMode',
            'onToggleMinimise',
            'onToggleOpenAccess',
            'onAdvancedSearchRowAdd',
            'onAdvancedSearchRowRemove',
            'onAdvancedSearchReset',
        ];
        defaultPropMethodNames.forEach(methodName => {
            expect(wrapper.instance().props[methodName]()).toBeUndefined();
        });
    });

    it('should render minimised view', () => {
        const wrapper = setup({ isMinimised: true });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render default view with open access checked', () => {
        const wrapper = setup({ isOpenAccess: true });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render advanced search row based on props', () => {
        const wrapper = setup({ isOpenAccess: true, fieldRows: [{ value: 'i feel lucky', searchField: 'all' }] });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should toggle minimised view for advanced search', () => {
        const testFn = jest.fn();
        const wrapper = setup({ onToggleMinimise: testFn });
        expect(toJson(wrapper)).toMatchSnapshot();

        wrapper.instance()._toggleMinimise();
        expect(testFn).toHaveBeenCalled();
    });

    it('should toggle open access for advanced search', () => {
        const testFn = jest.fn();
        const wrapper = setup({ onToggleOpenAccess: testFn });

        wrapper.instance()._toggleOpenAccess({ preventDefault: jest.fn() });
        expect(testFn).toHaveBeenCalled();
    });

    it('should toggle search mode from advanced to simple', () => {
        const testFn = jest.fn();
        const wrapper = setup({ onToggleSearchMode: testFn });

        wrapper.instance()._toggleSearchMode();
        expect(testFn).toHaveBeenCalled();
    });

    it('should add advanced search row', () => {
        const testMethod = jest.fn();
        const wrapper = setup({ onAdvancedSearchRowAdd: testMethod });

        wrapper.instance()._addAdvancedSearchRow();
        expect(testMethod).toHaveBeenCalled();
    });

    it('should remove advanced search row', () => {
        const testMethod = jest.fn();
        const wrapper = setup({ onAdvancedSearchRowRemove: testMethod });

        wrapper.instance()._removeAdvancedSearchRow();
        expect(testMethod).toHaveBeenCalled();
    });

    it('should reset advanced search', () => {
        const testMethod = jest.fn();
        const wrapper = setup({ onAdvancedSearchReset: testMethod });

        wrapper.instance()._resetAdvancedSearch();
        expect(testMethod).toHaveBeenCalled();
    });

    it('should handle changes in advanced search row', () => {
        const testMethod = jest.fn();
        const wrapper = setup({ onAdvancedSearchRowChange: testMethod });

        wrapper.instance()._handleAdvancedSearchRowChange(1, { searchField: 'all', value: 'test value' });
        expect(testMethod).toHaveBeenCalledWith(1, { searchField: 'all', value: 'test value' });
    });

    it("should not submit search if ENTER wasn't pressed", () => {
        const testMethod = jest.fn();
        const preventDefault = jest.fn();
        const wrapper = setup({ onSearch: testMethod });

        wrapper.instance()._handleAdvancedSearch({ key: 'a', preventDefault: preventDefault });
        expect(testMethod).not.toHaveBeenCalled();
    });

    it('should submit search if search text is not null and ENTER is pressed', () => {
        const testMethod = jest.fn();
        const preventDefault = jest.fn();
        const wrapper = setup({
            onSearch: testMethod,
            fieldRows: [
                {
                    searchField: 'all',
                    value: 'i feel lucky',
                },
            ],
        });

        wrapper.instance()._handleAdvancedSearch({ key: 'Enter', preventDefault: preventDefault });
        expect(testMethod).toHaveBeenCalled();
    });

    it('haveAllAdvancedSearchFieldsValidated should return false for a fieldRow which is too short', () => {
        const thisProps = {
            fieldRows: [{ searchField: 'rek_title', value: '123' }],
        };
        const wrapper = setup({ ...thisProps });
        expect(wrapper.instance().haveAllAdvancedSearchFieldsValidated(thisProps.fieldRows)).toBeTruthy();
    });

    it('haveAllAdvancedSearchFieldsValidated should return true for a fieldRow which is longer than minLength', () => {
        const thisProps = {
            fieldRows: [{ searchField: 'rek_title', value: '1234567890ABC' }],
        };
        const wrapper = setup({ ...thisProps });
        expect(wrapper.instance().haveAllAdvancedSearchFieldsValidated(thisProps.fieldRows)).toBeTruthy();
    });

    it(
        'haveAllAdvancedSearchFieldsValidated should return false for ' +
            'a fieldRow which is longer than the max length',
        () => {
            const thisProps = {
                fieldRows: [
                    {
                        searchField: 'rek_title',
                        value:
                            'OuuCJZb8JA35CrCl1wjx5WzgN2eAMBGryy72EGw7hB98P5P1SRwBDlHz2c1sej4YMIuzwPi3ewpAPiUp65sg' +
                            'JrL0BIVhr3S1ESxLpPfDlzgMSosPIT5Eq3WytsehVd8T8n5hy4akLPYQ1HTWYbSzvifjw79rbuMdvLGmXWS3' +
                            '6ljaluN6v3sg8gtwUi5owNsuEIPiaOquVkV1k8nqdDx1npntW9fTX0B84UvnzemXIWySCoeiIsZVNmjdonoC' +
                            '3SYT2dDIddraqgShz256k1ZC56P9M6Zgs9FpmeFUHwEuXHBxcWLmxGfsxpJhNuFNKnELD2rhWYq3RXkDm67F' +
                            'yYwDX9V8IpMBNfAZi8Bb57VFvFbuGqQo56D99mkTA7SfRoVcbd3mMkSDQdowH8Bpni2EFPdC1aKcsWGxPPIS' +
                            '4Cr93PVFJFp9X2zSvXGDQ0WRLzINYFUahICxwIkclTK4uc9N3c3Czmy06mchh8aMlHDaplncul8TOLV8J',
                    },
                ],
            };
            const wrapper = setup({ ...thisProps });
            expect(wrapper.instance().haveAllAdvancedSearchFieldsValidated(thisProps.fieldRows)).toBeFalsy();
        }
    );

    it('haveAllAdvancedSearchFieldsValidated should allow all field to be empty and empty field', () => {
        const thisProps = {
            fieldRows: [{ searchField: 'all', value: '' }, { searchField: '0', value: '' }],
        };
        const wrapper = setup({ ...thisProps });
        expect(wrapper.instance().haveAllAdvancedSearchFieldsValidated(thisProps.fieldRows)).toBeTruthy();
    });

    it('should render advanced search docTypes with checked values based on props', () => {
        const wrapper = setup({
            isOpenAccess: true,
            docTypes: [179, 202],
            fieldRows: [{ value: 'i feel lucky', searchField: 'all' }],
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render advanced search docTypes with checked values based on fixed invalid props', () => {
        const wrapper = setup({
            isOpenAccess: true,
            docTypes: ['179', '202'],
            fieldRows: [{ value: 'i feel lucky', searchField: 'all' }],
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render advanced search with no valid checked docTypes based on invalid props', () => {
        const wrapper = setup({
            isOpenAccess: true,
            docTypes: ['test', 202],
            fieldRows: [{ value: 'i feel lucky', searchField: 'all' }],
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render date range fields', () => {
        const updateDateRangeFn = jest.fn();
        const wrapper = setup({ isOpenAccess: true, showUnpublishedFields: true, updateDateRange: updateDateRangeFn });
        expect(toJson(wrapper)).toMatchSnapshot();

        wrapper
            .find('WithStyles(DateRangeField)')
            .get(0)
            .props.onChange({
                from: moment('10/10/2010', 'DD/MM/YYYY'),
                to: moment('12/10/2010', 'DD/MM/YYYY'),
            });

        expect(updateDateRangeFn).toHaveBeenCalledWith('rek_created_date', {
            from: moment('10/10/2010', 'DD/MM/YYYY'),
            to: moment('12/10/2010', 'DD/MM/YYYY'),
        });
    });
});
