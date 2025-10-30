import React from 'react';
import { render, WithRouter } from 'test-utils';

import Grid from '@mui/material/GridLegacy';

import ScrollToPos from './ScrollToPos';

const setup = ({ selector, x, y } = {}) => {
    return render(
        <WithRouter>
            <Grid container id="testElement" data-testid="test-element">
                <ScrollToPos selector={selector} x={x} y={y} />
            </Grid>
            ,
        </WithRouter>,
    );
};

describe('ScrollToPos', () => {
    const elScrollFn = jest.fn();
    const globalScrollFn = jest.fn();
    beforeEach(() => {
        window.HTMLElement.prototype.scrollTo = elScrollFn;
        global.scrollTo = globalScrollFn;
    });
    it('should call scrollTo with provided values', () => {
        const { getByTestId } = setup({ selector: '[data-testid="test-element"]', x: 0, y: 2000 });
        const container = getByTestId('test-element');
        expect(container).toBeInTheDocument();
        expect(elScrollFn).toHaveBeenCalledWith(0, 2000);
    });
    it('should call scrollTo with default values', () => {
        const { getByTestId } = setup();
        const container = getByTestId('test-element');
        expect(container).toBeInTheDocument();
        expect(globalScrollFn).toHaveBeenCalledWith(0, 0);
    });
});
