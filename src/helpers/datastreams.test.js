import { isAudioXT, isDerivative } from './datastreams';

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

describe('datastream audio helpers', () => {
    it('recognises audio files', () => {
        const datastream = {
            dsi_dsid: 'audiotest_xt.mp3',
            dsi_mimetype: 'audio/wav',
        };
        const actual = isAudioXT(datastream);
        expect(actual).toEqual(true);
    });

    it('discriminates on badly named non-audio files', () => {
        const datastream = {
            dsi_dsid: 'audiotest_xt.mp3',
            dsi_mimetype: 'application/xml',
        };
        const actual = isAudioXT(datastream);
        expect(actual).toEqual(false);
    });

    it('recognises non audio files', () => {
        const datastream = {
            dsi_dsid: 'preview_testA.txt',
        };
        const actual = isAudioXT(datastream);
        expect(actual).toEqual(false);
    });
});
