import {lowerCase, upperCase, sentenceCase, titleCase, toggleCase} from '../src/utils';

describe('utils', () => {
  describe('lowerCase', () => {
    it('string to lowerCase', () => {
      const result = lowerCase('I_AM_ACTUALLY_SMALL');
      expect(result).toBe('i_am_actually_small');
    });

    it('number to lowerCase', () => {
      let result;
      try {
        result = lowerCase(42);
      } catch (e) {
        expect(e.message).toEqual('text.toLowerCase is not a function');
      }
      expect(result).toBe(undefined);
    });
  });

  describe('sentenceCase', () => {
    it('string to sentenceCase', () => {
      const result = sentenceCase('i am a sentence');
      expect(result).toBe('I am a sentence');
    });

    it('string to sentenceCase', () => {
      const result = sentenceCase('I AM A SENTENCE');
      expect(result).toBe('I am a sentence');
    });

    it('string to sentenceCase', () => {
      const result = sentenceCase('I am A SeNTenCE');
      expect(result).toBe('I am a sentence');
    });

  });

  describe('titleCase', () => {
    it('string to titleCase', () => {
      const result = titleCase('i am a title');
      expect(result).toBe('I Am A Title');
    });

    it('string to titleCase', () => {
      const result = titleCase('I AM A TITLE');
      expect(result).toBe('I Am A Title');
    });

    it('string to titleCase', () => {
      const result = titleCase('I am A TiTlE');
      expect(result).toBe('I Am A Title');
    });
  });

  describe('toggleCase', () => {
    it('string to toggleCase', () => {
      const result = toggleCase('i am a toggle');
      expect(result).toBe('i aM a tOGGLE');
    });

    it('string to toggleCase', () => {
      const result = toggleCase('I AM A TOGGLE');
      expect(result).toBe('i aM a tOGGLE');
    });

    it('string to toggleCase', () => {
      const result = toggleCase('I am A ToGGLE');
      expect(result).toBe('i aM a tOGGLE');
    });
  });

  describe('upperCase', () => {
    it('string to upperCase', () => {
      const result = upperCase('i_am_actually_big');
      expect(result).toBe('I_AM_ACTUALLY_BIG');
    });

    it('string to upperCase', () => {
      const result = upperCase('i_aM_acTuAllY_bIg');
      expect(result).toBe('I_AM_ACTUALLY_BIG');
    });
  });
});
