import { findCurrentChild } from './fnVocab';
import { vocabsFieldResearch } from 'mock/data/vocabs-field-research.js';

describe('Test findCurrentChild', () => {
    it('returns the top level when specifying 0', () => {
        const list = findCurrentChild(vocabsFieldResearch.data, 0);
        expect(list[0].cvr_parent_cvo_id).toEqual(451780);
        expect(list[0]).toHaveProperty('controlled_vocab');
    });

    it('returns the top level', () => {
        const list = findCurrentChild(vocabsFieldResearch.data, 451780);
        expect(list[0].cvr_parent_cvo_id).toEqual(451780);
        expect(list[0]).toHaveProperty('controlled_vocab');
    });

    it('returns the child level', () => {
        const list = findCurrentChild(vocabsFieldResearch.data, 451799);
        console.log('list=', list);
        expect(list[0].cvr_parent_cvo_id).toEqual(451799);
        expect(list[0]).toHaveProperty('controlled_vocab');
    });

    it('returns the 3rd level', () => {
        const list = findCurrentChild(vocabsFieldResearch.data, 451800);
        expect(list[0].cvr_parent_cvo_id).toEqual(451800);
        expect(list[0]).toHaveProperty('controlled_vocab');
    });

    it('returns []', () => {
        const list = findCurrentChild(vocabsFieldResearch.data, 451801);
        expect(list).toEqual([]);
    });
});
