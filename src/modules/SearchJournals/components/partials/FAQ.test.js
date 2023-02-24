import React from 'react';
import { fireEvent, rtlRender } from 'test-utils';

import { FAQ } from './FAQ';
import locale from '../../../../locale/components';

function setup(render = rtlRender) {
    return render(<FAQ />);
}

describe('FAQ partial', () => {
    it('should render all', () => {
        const { getByText } = setup();
        const txt = locale.components.searchJournals.partials.FAQ;
        expect(getByText(txt.title)).toBeInTheDocument();
        txt.items.map(faq => {
            expect(getByText(faq.question)).toBeInTheDocument();
            expect(faq.answer).toBeInTheDocument;
        });
    });
    it('should toggle answer', () => {
        const { getByTestId } = setup();
        const index = 1;
        expect(getByTestId(`faq-summary-${index}`)).toHaveAttribute('aria-expanded', 'false');
        fireEvent.click(getByTestId(`faq-summary-${index}`));
        expect(getByTestId(`faq-summary-${index}`)).toHaveAttribute('aria-expanded', 'true');
        fireEvent.click(getByTestId(`faq-summary-${index}`));
        expect(getByTestId(`faq-summary-${index}`)).toHaveAttribute('aria-expanded', 'false');
    });
});
