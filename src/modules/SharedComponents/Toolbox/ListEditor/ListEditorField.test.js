import ListEditorField from './ListEditorField';

describe('ListEditorField function', () => {
    it('should return <FreeTextListEditor> with specified props', () => {
        const props = {
            state: {
                error: 'test1',
            },
            onChange: jest.fn(),
            remindToAdd: 'test2',
            maxInputLength: 100,
        };
        expect(ListEditorField(props)).toMatchSnapshot();

        delete props.state;
        expect(ListEditorField(props)).toMatchSnapshot();
    });
});
