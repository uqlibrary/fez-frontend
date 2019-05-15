import { leftJoin } from './general';

describe('general helpers', () => {
    it('leftJoin', () => {
        const objArrA = [
            { nameA: 'test1', 'testA': 'testA1' },
            { nameA: 'test2', 'testA': 'testA2' },
            { nameA: 'test3', 'testA': 'testA3' },
        ];
        const objArrB = [
            { nameB: 'test1', 'testB': 'testB1' },
            { nameB: 'test2', 'testB': 'testB2' },
            { nameB: 'test3', 'testB': 'testB3' },
        ];
        const actual = leftJoin(objArrA, objArrB, 'nameA', 'nameB');
        const expected = [
            { nameA: 'test1', 'testA': 'testA1', nameB: 'test1', 'testB': 'testB1' },
            { nameA: 'test2', 'testA': 'testA2', nameB: 'test2', 'testB': 'testB2' },
            { nameA: 'test3', 'testA': 'testA3', nameB: 'test3', 'testB': 'testB3' },
        ];
        expect(actual).toEqual(expected);
        expect(leftJoin(objArrA)).toBe(objArrA);
    });
});