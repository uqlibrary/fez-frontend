import { isDerivative } from './datastreams';

describe('datastream derivative helpers', () => {
    it('is not Derivative', () => {
        const datastream = {
            dsi_dsid: 'test7.txt',
        };
        const actual = isDerivative(datastream);
        expect(actual).toEqual(false);
    });

    it('is Derivative', () => {
        const datastream = {
            dsi_dsid: 'preview_test8.txt',
        };
        const actual = isDerivative(datastream);
        expect(actual).toEqual(true);
    });
});
