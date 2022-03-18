import DateCitationView from './DateCitationView';
import { PLACEHOLDER_ISO8601_ZULU_DATE } from '../../../../../../config/general';

function setup(testProps = {}) {
    // build full props list required by the component
    const props = {
        classes: {},
        ...testProps,
    };
    return getElement(DateCitationView, props);
}

describe('DateCitationView test', () => {
    it('should render empty component with no date', () => {
        const wrapper = setup();
        expect(wrapper.find('span.citationDate.empty').text()).toBe('');
    });

    it('should render empty component with a placeholder date', () => {
        const wrapper = setup({ date: PLACEHOLDER_ISO8601_ZULU_DATE });
        expect(wrapper.find('span.citationDate.empty').text()).toBe('');
    });

    it('should render component with date not in TZ format', () => {
        const wrapper = setup({ date: '2010-08-01 00:00:00' });
        expect(wrapper.find('span.citationDate').text()).toBe('(2010).');
    });

    it('should render component with date in TZ format', () => {
        const wrapper = setup({ date: '2017-07-01T00:00:00Z' });
        expect(wrapper.find('span.citationDate').text()).toBe('(2017).');
    });

    it('should render component with date : [July 1st, 2017]', () => {
        const wrapper = setup({ date: '2017-07-01T00:00:00Z', format: 'MMMM Do[,] YYYY', prefix: '[', suffix: ']' });
        expect(wrapper.find('span.citationDate').text()).toBe('[July 1st, 2017]');
    });

    it('should render component with default prefix and suffix : (2017).', () => {
        const wrapper = setup({ date: '2017-07-01T00:00:00Z' });
        expect(wrapper.find('span.citationDate').text()).toBe('(2017).');
    });

    it('should render component with date : On the 1st day of July in 2017', () => {
        const wrapper = setup({
            date: '2017-07-01T00:00:00Z',
            format: '[On the ]Do[ day of ]MMMM[ in ]YYYY',
            prefix: '',
            suffix: '',
        });
        expect(wrapper.find('span.citationDate').text()).toBe('On the 1st day of July in 2017');
    });

    it('should render component with just the year in brackets : (2017).', () => {
        const wrapper = setup({ date: '2017-07-01T00:00:00Z', format: 'YYYY', prefix: '(', suffix: ').' });
        expect(wrapper.find('span.citationDate').text()).toBe('(2017).');
    });

    it("should render component with date in user's timezone", () => {
        const wrapper = setup({ date: '2017-06-30T22:00:00Z', format: 'YYYY-MM-DD', isLocalised: true });
        expect(wrapper.find('span.citationDate').text()).toBe('(2017-07-01).');
    });

    it('should render year-only date when the date is Jan 1st', () => {
        const wrapper = setup({ date: '2017-01-01T00:00:00Z', format: 'YYYY-MM-DD', isLocalised: true });
        expect(wrapper.find('span.citationDate').text()).toBe('(2017).');
        const wrapper2 = setup({ date: '2017-01-01T00:00:00Z', format: 'YYYY-MM-DD', isLocalised: false });
        expect(wrapper2.find('span.citationDate').text()).toBe('(2017).');
    });
});
