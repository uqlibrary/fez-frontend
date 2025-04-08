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
            state: {
                error: true,
            },
        });
        expect(test2.error).toBe(true);
        expect(test2.errorText).toBe(true);
    });
});
