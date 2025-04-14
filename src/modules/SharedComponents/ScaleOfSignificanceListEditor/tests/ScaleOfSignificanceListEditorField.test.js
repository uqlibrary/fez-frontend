import ScaleOfSignificanceListEditorField from '../ScaleOfSignificanceListEditorField';

describe('ScaleOfSignificanceListEditorField function', () => {
    it('should return <ScaleOfSignificanceListEditor>', () => {
        const props = { input: { onChange: jest.fn() } };
        expect(ScaleOfSignificanceListEditorField(props)).toMatchSnapshot();
    });

    it('should return <ScaleOfSignificanceListEditor> with error attributes', () => {
        const props = { input: { onChange: jest.fn() }, meta: { errorText: 'test' } };
        expect(ScaleOfSignificanceListEditorField(props)).toMatchSnapshot();
    });
});
