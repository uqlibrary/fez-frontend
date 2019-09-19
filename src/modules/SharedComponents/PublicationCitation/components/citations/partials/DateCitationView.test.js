import DateCitationView from './DateCitationView';

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
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render empty component with a placeholder date', () => {
        const wrapper = setup({ date: '1000-01-01T00:00:00Z' });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with date not in TZ format', () => {
        const wrapper = setup({ date: '2010-08-01 00:00:00' });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with date in TZ format', () => {
        const wrapper = setup({ date: '2017-07-01T00:00:00Z' });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with date : [July 1st, 2017]', () => {
        const wrapper = setup({ date: '2017-07-01T00:00:00Z', format: 'MMMM Do[,] YYYY', prefix: '[', suffix: ']' });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with default prefix and suffix : (1/6/2017).', () => {
        const wrapper = setup({ date: '2017-07-01T00:00:00Z' });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with date : On the 1st day of June in 2017', () => {
        const wrapper = setup({
            date: '2017-07-01T00:00:00Z',
            format: '[On the ]Do[ day of ]MMMM[ in ]YYYY',
            prefix: '',
            suffix: '',
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with just the year in brackets : (2017).', () => {
        const wrapper = setup({ date: '2017-07-01T00:00:00Z', format: 'YYYY', prefix: '(', suffix: ').' });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it("should render component with date in user's timezone", () => {
        const wrapper = setup({ date: '2017-06-30T22:00:00Z', format: 'YYYY-MM-DD', isLocalised: true });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
