import React from 'react';
import PartialDateForm from './PartialDateForm';
import { fireEvent, rtlRender, screen } from 'test-utils';

function setup(testProps = {}, renderer = rtlRender) {
    const props = {
        allowPartial: false,
        partialDateFormId: 'test',
        classes: testProps.classes || {
            hideLabel: 'hidden',
        },
        ...testProps,
    };

    return renderer(<PartialDateForm {...props} required={testProps.required} />);
}

describe('PartialDateForm component', () => {
    it('should render comp', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });

    it('should render comp as a required field', () => {
        const { container, getByTestId } = setup({ required: true, onChange: jest.fn() });
        fireEvent.change(getByTestId('test-day-input'), { target: { value: '1' } });
        expect(container).toMatchSnapshot();
    });

    it('should display errors correctly', () => {
        const { container, getByText } = setup({
            allowPartial: true,
            onChange: jest.fn(),
        });
        expect(getByText('Invalid date')).toBeInTheDocument();
        expect(container).toMatchSnapshot();
    });

    it('should handle partial values', () => {
        const { container, getByTestId, getByRole } = setup({
            allowPartial: true,
            onChange: jest.fn(),
        });

        fireEvent.change(getByTestId('test-day-input'), { target: { value: '1' } });
        expect(container).toMatchSnapshot();

        fireEvent.mouseDown(getByTestId('test-month-select'));
        fireEvent.click(getByRole('option', { name: 'May' }));
        expect(container).toMatchSnapshot();
    });

    it('should handle partial values day and year only', () => {
        const { container, getByTestId } = setup({
            allowPartial: true,
            onChange: jest.fn(),
        });

        fireEvent.change(getByTestId('test-day-input'), { target: { value: '1' } });
        fireEvent.change(getByTestId('test-year-input'), { target: { value: '2010' } });
        expect(container).toMatchSnapshot();
    });

    it('should handle partial values with year only', () => {
        const { container, getByTestId } = setup({
            allowPartial: true,
            onChange: jest.fn(),
        });

        fireEvent.change(getByTestId('test-year-input'), { target: { value: '2010' } });
        expect(container).toMatchSnapshot();
    });

    it('should handle keypress', () => {
        const { container, getByTestId } = setup({
            allowPartial: true,
            onChange: jest.fn(),
        });

        fireEvent.keyPress(getByTestId('test-day-input'), { key: '!', charCode: 33 });
        expect(container).toMatchSnapshot();
        fireEvent.keyPress(getByTestId('test-day-input'), { key: ';', charCode: 59 });
        expect(container).toMatchSnapshot();
        fireEvent.keyPress(getByTestId('test-day-input'), { key: '0', charCode: 48 });
        expect(container).toMatchSnapshot();
    });

    it('should load existing values', () => {
        const { container } = setup({
            allowPartial: true,
            onChange: jest.fn(),
            defaultValue: '2020-02-02',
        });
        expect(container).toMatchSnapshot();
    });
    it('should load existing values for month of January', () => {
        const { container } = setup({
            allowPartial: true,
            onChange: jest.fn(),
            defaultValue: '2020-01-01',
        });
        expect(container).toMatchSnapshot();
    });
    it('should load existing values for month of December', () => {
        const { container } = setup({
            allowPartial: true,
            onChange: jest.fn(),
            defaultValue: '2020-12-01',
        });
        expect(container).toMatchSnapshot();
    });

    it('should load existing values from input value', () => {
        const { container } = setup({
            allowPartial: true,
            onChange: jest.fn(),
            value: '2020-02-02',
        });
        expect(container).toMatchSnapshot();
    });

    const assertDateFieldValues = (day, month, year) => {
        expect(screen.getByTestId('test-day-input').value).toBe(day);
        expect(screen.getByTestId('test-month-input').value).toBe(month);
        expect(screen.getByTestId('test-year-input').value).toBe(year);
    };

    it('should update state as expected when mounting', () => {
        // initial render
        const { rerender } = setup({
            allowPartial: true,
            value: '2020-02-02',
        });
        assertDateFieldValues('2', '1', '2020');

        // check date changes when new day value provided in props
        setup(
            {
                allowPartial: true,
                value: '2021-03-01',
            },
            rerender,
        );
        assertDateFieldValues('1', '2', '2021');
    });

    describe('with clearable flag', () => {
        it('should display an error on clearing one partial date field', async () => {
            const { getByText, queryByText, getByTestId } = setup({
                allowPartial: false,
                onChange: jest.fn(),
                defaultValue: '2017-02-02',
                clearable: true,
            });
            expect(queryByText('Invalid date')).not.toBeInTheDocument();

            // delete date and check for an error
            fireEvent.change(getByTestId('test-day-input'), { target: { value: '' } });
            expect(getByText('Invalid date')).toBeInTheDocument();
        });

        it('should not display an error on clearing whole partial date field', () => {
            const { queryByText, getByRole, getByTestId } = setup({
                allowPartial: false,
                onChange: jest.fn(),
                defaultValue: '2017-02-02',
                clearable: true,
            });
            // clear whole date and check for not an error
            fireEvent.change(getByTestId('test-day-input'), { target: { value: '' } });
            fireEvent.mouseDown(getByTestId('test-month-select'));
            fireEvent.click(getByRole('option', { name: 'Month' }));
            fireEvent.change(getByTestId('test-year-input'), { target: { value: '' } });
            expect(queryByText('Invalid date')).not.toBeInTheDocument();
        });

        it('should not display an error on entering valid date', () => {
            const { queryByText, getByTestId } = setup({
                allowPartial: false,
                onChange: jest.fn(),
                defaultValue: '2017-02-02',
                clearable: true,
            });
            // enter valid date and check for not an error
            fireEvent.change(getByTestId('test-day-input'), { target: { value: '12' } });
            fireEvent.change(getByTestId('test-month-input'), { target: { value: 3 } });
            fireEvent.change(getByTestId('test-year-input'), { target: { value: '1990' } });
            expect(queryByText('Invalid date')).not.toBeInTheDocument();
        });

        it('should display an error on entering future date', () => {
            const { getByText, getByTestId } = setup({
                allowPartial: false,
                onChange: jest.fn(),
                defaultValue: '2017-02-02',
                clearable: true,
            });
            // enter future date and check for an error
            fireEvent.change(getByTestId('test-year-input'), { target: { value: '2050' } });

            expect(getByText('Invalid date')).toBeInTheDocument();
        });

        it('should display an future date error on entering future date', () => {
            const { getByText, getByTestId } = setup({
                allowPartial: false,
                disableFuture: true,
                onChange: jest.fn(),
                defaultValue: '2017-02-02',
                clearable: true,
            });
            // enter future date and check for an error
            fireEvent.change(getByTestId('test-year-input'), { target: { value: '2050' } });

            expect(getByText('Date must be before now')).toBeInTheDocument();
        });

        it('should display an future date error on entering future date when allow partial', () => {
            const { getByText, getByTestId } = setup({
                allowPartial: true,
                disableFuture: true,
                onChange: jest.fn(),
                defaultValue: '2017-02-02',
                clearable: true,
            });
            // enter future date and check for an error
            fireEvent.change(getByTestId('test-year-input'), { target: { value: '2050' } });

            expect(getByText('Date must be before now')).toBeInTheDocument();
        });

        it('should display an error on entering invalid date', () => {
            const { getByText, getByTestId } = setup({
                allowPartial: false,
                onChange: jest.fn(),
                defaultValue: '2017-02-02',
                clearable: true,
            });
            // enter invalid date and check for an error
            fireEvent.change(getByTestId('test-day-input'), { target: { value: '29' } });
            fireEvent.change(getByTestId('test-month-input'), { target: { value: 1 } });
            expect(getByText('Invalid date')).toBeInTheDocument();
        });

        it('should display an error on entering invalid day', () => {
            const { getByText, getByTestId } = setup({
                allowPartial: false,
                onChange: jest.fn(),
                defaultValue: '2017-02-02',
                clearable: true,
            });
            // enter invalid date and check for an error
            fireEvent.change(getByTestId('test-day-input'), { target: { value: '33' } });
            expect(getByText('Invalid day')).toBeInTheDocument();
        });
    });
});
