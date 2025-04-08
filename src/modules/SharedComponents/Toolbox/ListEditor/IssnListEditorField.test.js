import IssnListEditorField, { normalizeIssn, transformIssn } from './IssnListEditorField';

describe('IssnListEditorField function', () => {
    it('should return <ListEditor>', () => {
        const props = { onChange: jest.fn(), listEditorId: 'issn-list-editor' };
        expect(IssnListEditorField(props)).toMatchSnapshot();
    });

    it('should return <ListEditor> with error attributes', () => {
        const props = { onChange: jest.fn(), state: { error: 'test' }, listEditorId: 'issn-list-editor' };
        expect(IssnListEditorField(props)).toMatchSnapshot();
    });

    describe('helpers', () => {
        it('should normalize the issn input value', () => {
            expect(normalizeIssn('12345678')).toEqual('1234-5678');
            expect(normalizeIssn('1234-5678')).toEqual('1234-5678');
            expect(normalizeIssn('1234')).toEqual('1234');
        });

        it('should transform the issn output value', () => {
            expect(transformIssn({ value: 'rek_issn', order: 'rek_issn_order' }, { key: '1234-5678' }, 3)).toEqual({
                rek_issn: '1234-5678',
                rek_issn_order: 4,
            });
        });
    });
});
