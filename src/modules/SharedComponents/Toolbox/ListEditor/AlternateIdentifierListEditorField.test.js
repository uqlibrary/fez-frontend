import AlternateIdentifierListEditorField from './AlternateIdentifierListEditorField';

describe('AlternateIdentifierListEditorField function', () => {
    it('should return AlternateIdentifierListEditorField', () => {
        const props = { input: { onChange: jest.fn() } };
        expect(AlternateIdentifierListEditorField(props)).toMatchSnapshot();
    });

    it('should return AlternateIdentifierListEditorField with error attributes', () => {
        const props = { input: { onChange: jest.fn() }, meta: { error: 'test' } };
        expect(AlternateIdentifierListEditorField(props)).toMatchSnapshot();
    });
});
