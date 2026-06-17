import { getDefaultOperand } from './journalSearch';

it('getDefaultOperand()', () => {
    expect(getDefaultOperand('Keyword')).toEqual('AND');
    expect(getDefaultOperand('title')).toEqual('OR');
});
