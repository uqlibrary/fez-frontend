import { getActionSuffix } from './actionTypes';

describe('getActionSuffix', () => {
    it('should get suffix', () => {
        expect(getActionSuffix('test@something')).toBe('something');
    });
});
