import React from 'react';
import { render } from 'test-utils';
import JournalsOpenAccessIndicator from './JournalsOpenAccessIndicator';

import { types, status } from './utils';

const defaultLabel = 'Test label';
const defaultTooltip = 'Test tooltip';
const setup = testProps => {
    const props = {
        id: 'testIndicator',
        label: defaultLabel,
        tooltip: defaultTooltip,
        ...testProps,
    };
    return render(<JournalsOpenAccessIndicator {...props} />);
};

const assertIndicator = (element, type, status, label = defaultLabel, tooltip = defaultTooltip) => {
    expect(element).toBeInTheDocument();
    expect(element).toHaveAttribute('aria-label', tooltip);
    expect(element).toHaveClass(type, status);
    expect(element).toHaveTextContent(label);
};

describe('JournalsOpenAccessIndicator', () => {
    describe('accepted statuses', () => {
        it('renders OPEN', () => {
            const { getByTestId } = setup({ type: types.accepted, status: status.open });
            assertIndicator(getByTestId('open-access-testIndicator'), types.accepted, status.open);
        });
        it('renders CAP', () => {
            const { getByTestId } = setup({ type: types.accepted, status: status.cap });
            assertIndicator(getByTestId('open-access-testIndicator'), types.accepted, status.cap);
        });
        it('renders EMBARGO', () => {
            const { getByTestId } = setup({ type: types.accepted, status: status.embargo });
            assertIndicator(getByTestId('open-access-testIndicator'), types.accepted, status.embargo);
        });
        it('renders FEE', () => {
            const { getByTestId } = setup({ type: types.accepted, status: status.fee });
            assertIndicator(getByTestId('open-access-testIndicator'), types.accepted, status.fee);
        });
    });

    describe('published statuses', () => {
        it('renders OPEN', () => {
            const { getByTestId } = setup({ type: types.published, status: status.open });
            assertIndicator(getByTestId('open-access-testIndicator'), types.published, status.open);
        });
        it('renders Diamond Icon', () => {
            const { getByTestId } = setup({ type: types.published, status: status.open, showDiamond: true });
            expect(getByTestId('DiamondIcon')).toBeInTheDocument();
        });
        it('renders S2O Icon', () => {
            const { getByTestId } = setup({ type: types.published, status: status.open, showS2O: true });
            expect(getByTestId('open-access-testIndicator')).toHaveTextContent('S2O');
            assertIndicator(getByTestId('open-access-testIndicator'), types.published, status.open);
        });
        it('renders CAP', () => {
            const { getByTestId } = setup({ type: types.published, status: status.cap });
            assertIndicator(getByTestId('open-access-testIndicator'), types.published, status.cap);
        });
        it('renders EMBARGO', () => {
            const { getByTestId } = setup({ type: types.published, status: status.embargo });
            assertIndicator(getByTestId('open-access-testIndicator'), types.published, status.embargo);
        });
        it('renders FEE', () => {
            const { getByTestId } = setup({ type: types.published, status: status.fee });
            assertIndicator(getByTestId('open-access-testIndicator'), types.published, status.fee);
        });
    });

    describe('coverage', () => {
        it('doesnt render tooltips if none provided', () => {
            const { getByTestId } = setup({ type: types.accepted, status: status.open, tooltip: null });
            expect(getByTestId('open-access-testIndicator')).toBeInTheDocument();
            expect(getByTestId('open-access-testIndicator')).not.toHaveAttribute('aria-label');
            expect(getByTestId('open-access-testIndicator')).toHaveTextContent(defaultLabel);
        });

        it('defaults to rendering status value if no label provided', () => {
            const { getByTestId } = setup({ type: types.accepted, status: status.open, label: null });
            expect(getByTestId('open-access-testIndicator')).toBeInTheDocument();
            expect(getByTestId('open-access-testIndicator')).toHaveTextContent(status.open);
        });
    });
});
