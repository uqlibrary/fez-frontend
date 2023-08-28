import React from 'react';
import DateCitationView from './DateCitationView';
import { PLACEHOLDER_ISO8601_ZULU_DATE } from 'config/general';
import { rtlRender } from 'test-utils';

function setup(testProps = {}) {
    // build full props list required by the component
    const props = {
        classes: {},
        ...testProps,
    };
    return rtlRender(<DateCitationView {...props} />);
}

describe('DateCitationView test', () => {
    it('should render empty component with no date', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });

    it('should render empty component with a placeholder date', () => {
        const { container } = setup({ date: PLACEHOLDER_ISO8601_ZULU_DATE });
        expect(container).toMatchSnapshot();
    });

    it('should render component with date not in TZ format', () => {
        const { getByText } = setup({ date: '2010-08-01 00:00:00' });
        expect(getByText('(2010).')).toBeInTheDocument();
    });

    it('should render component with date in TZ format', () => {
        const { getByText } = setup({ date: '2017-07-01T00:00:00Z' });
        expect(getByText('(2017).')).toBeInTheDocument();
    });

    it('should render component with date : [July 1st, 2017]', () => {
        const { getByText } = setup({
            date: '2017-07-01T00:00:00Z',
            format: 'MMMM Do[,] YYYY',
            prefix: '[',
            suffix: ']',
        });
        expect(getByText('[July 1st, 2017]')).toBeInTheDocument();
    });

    it('should render component with default prefix and suffix : (2017).', () => {
        const { getByText } = setup({ date: '2017-07-01T00:00:00Z' });
        expect(getByText('(2017).')).toBeInTheDocument();
    });

    it('should render component with date : On the 1st day of July in 2017', () => {
        const { getByText } = setup({
            date: '2017-07-01T00:00:00Z',
            format: '[On the ]Do[ day of ]MMMM[ in ]YYYY',
            prefix: '',
            suffix: '',
        });
        expect(getByText('On the 1st day of July in 2017')).toBeInTheDocument();
    });

    it('should render component with just the year in brackets : (2017).', () => {
        const { getByText } = setup({ date: '2017-07-01T00:00:00Z', format: 'YYYY', prefix: '(', suffix: ').' });
        expect(getByText('(2017).')).toBeInTheDocument();
    });

    it("should render component with date in user's timezone", () => {
        const { getByText } = setup({ date: '2017-06-30T22:00:00Z', format: 'YYYY-MM-DD', isLocalised: true });
        expect(getByText('(2017-07-01).')).toBeInTheDocument();
    });

    it('should render year-only date when the date is Jan 1st with localised', () => {
        const { getByText } = setup({ date: '2017-01-01T00:00:00Z', format: 'YYYY-MM-DD', isLocalised: true });
        expect(getByText('(2017).')).toBeInTheDocument();
    });

    it('should render year-only date when the date is Jan 1st without localised', () => {
        const { getByText } = setup({ date: '2017-01-01T00:00:00Z', format: 'YYYY-MM-DD', isLocalised: false });
        expect(getByText('(2017).')).toBeInTheDocument();
    });
});
