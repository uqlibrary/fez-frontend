import { escapeRegExp } from './FieldOfResearchField';

const failingRegEx = searchText => new RegExp(`(?=^[\\d]{4}\\s.+).*${searchText}.*`, 'gi');

const improvedRegEx = searchText => new RegExp(`(?=^[\\d]{4}\\s.+).*${escapeRegExp(searchText)}.*`, 'gi');

describe('FieldOfResearchField ', () => {
    it('should correctly throw exception for invalid regex', () => {
        expect(() => {
            failingRegEx('Science (Bio');
        }).toThrow();
    });

    it('should correctly escape string for regex', () => {
        expect(() => {
            improvedRegEx('Science (Bio');
        }).not.toThrow();
    });
});
