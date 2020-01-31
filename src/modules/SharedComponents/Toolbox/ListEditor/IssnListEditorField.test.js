import IssnListEditorField from './IssnListEditorField';

describe('IssnListEditorField function', () => {
    it('should return <issnListEditor>', () => {
        const props = { input: { onChange: jest.fn() } };
        expect(IssnListEditorField(props)).toMatchSnapshot();
    });

    it('should return <issnListEditor> with error attributes', () => {
        const props = { input: { onChange: jest.fn() }, meta: { error: 'test' } };
        expect(IssnListEditorField(props)).toMatchSnapshot();
    });
});
