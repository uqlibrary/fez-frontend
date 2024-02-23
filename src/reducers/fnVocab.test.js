import { findCurrentChild } from './fnVocab';
import { vocabsFieldResearch } from 'mock/data/vocabs-field-research.js';

describe('Test findCurrentChild', () => {
    it('returns the top level when specifying 0', () => {
        const [list, path] = findCurrentChild(vocabsFieldResearch.data, 0, []);
        expect(list[0].cvr_parent_cvo_id).toEqual(451780);
        expect(list[0]).toHaveProperty('controlled_vocab');
        expect(path).toEqual([]);
    });

    it('returns the top level', () => {
        const [list, path] = findCurrentChild(vocabsFieldResearch.data, 451780);
        expect(list[0].cvr_parent_cvo_id).toEqual(451780);
        expect(list[0]).toHaveProperty('controlled_vocab');
        expect(path).toEqual([]);
    });

    it('returns the child level', () => {
        const [list, path] = findCurrentChild(vocabsFieldResearch.data, 451799);
        expect(list[0].cvr_parent_cvo_id).toEqual(451799);
        expect(list[0]).toHaveProperty('controlled_vocab');
        expect(path).toEqual([{ id: 451799, title: '01 Mathematical Sciences' }]);
    });

    it('returns the 3rd level', () => {
        const [list, path] = findCurrentChild(vocabsFieldResearch.data, 451800, []);
        expect(list[0].cvr_parent_cvo_id).toEqual(451800);
        expect(list[0]).toHaveProperty('controlled_vocab');
        expect(path).toEqual([
            { id: 451799, title: '01 Mathematical Sciences' },
            { id: 451800, title: '0101 Pure Mathematics' },
        ]);
    });

    it('returns the 4th level', () => {
        const [list, path] = findCurrentChild(vocabsFieldResearch.data, 451801, []);
        console.log('retpath=', path);
        expect(list).toEqual([]);
        expect(path).toEqual([
            { id: 451799, title: '01 Mathematical Sciences' },
            { id: 451800, title: '0101 Pure Mathematics' },
            { id: 451801, title: '010101 Algebra and Number Theory' },
        ]);
    });

    it('returns []', () => {
        const [list, path] = findCurrentChild([], 451801, []);
        expect(list).toEqual([]);
        expect(path).toEqual([]);
    });
});
