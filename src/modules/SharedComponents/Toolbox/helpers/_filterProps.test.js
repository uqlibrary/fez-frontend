import filterProps from './_filterProps';

describe('filterProps helper', () => {
    it('should set error status as required', () => {
        const errorText = 'Error: Something bad happened.';
        const test1 = filterProps({
            error: true,
            errorText: errorText,
        });
        expect(test1.error).toBe(true);
        expect(test1.errorText).toBe(errorText);

        const test2 = filterProps({
            forceError: true,
            meta: {
                error: true,
            },
        });
        expect(test2.error).toBe(true);
        expect(test2.errorText).toBe(true);

        const test3 = filterProps({
            meta: {
                touched: true,
                warn: true,
            },
        });
        expect(test3.error).toBe(true);
        expect(test3.errorText).toBe(true);

        const test4 = filterProps({
            meta: {
                touched: true,
            },
        });
        expect(test4.error).toBeUndefined();
        expect(test4.errorText).toBeUndefined();
    });
});
