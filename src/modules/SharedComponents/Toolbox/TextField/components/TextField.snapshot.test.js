import TextField from './TextField';
import filterProps from '../../helpers/_filterProps';

function setup(testProps, isShallow = true) {
    const props = {...testProps};
    const consolidatedProps = filterProps(props, TextField.propTypes);
    return getElement(TextField, consolidatedProps, isShallow);
}

describe('TextFieldWrapper snapshots tests', () => {
    it('renders TextField component', () => {
        const props =
            {
                name: 'testField',
                type: 'text',
                fullWidth: true,
                floatingLabelText: 'This is a test textfield component'
            };

        const wrapper = setup(props);
        const tree = toJson(wrapper);
        expect(tree).toMatchSnapshot();
    });
    it('renders TextField component appending a class', () => {
        const props =
            {
                name: 'testField',
                type: 'text',
                fullWidth: true,
                floatingLabelText: 'This is a test textfield component',
                className: 'requiredField'
            };

        const wrapper = setup(props);
        const tree = toJson(wrapper);
        expect(tree).toMatchSnapshot();
    });
});
