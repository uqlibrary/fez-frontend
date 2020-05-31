import { TextFieldWrapper } from './TextField';
import filterProps from '../../helpers/_filterProps';

function setup(testProps, isShallow = true) {
    const props = { ...testProps };
    const consolidatedProps = filterProps(props, TextFieldWrapper.propTypes);
    return getElement(TextFieldWrapper, { ...consolidatedProps, textFieldId: 'test' }, isShallow);
}

describe('TextFieldWrapper snapshots tests', () => {
    const testProps = {
        name: 'testField',
        type: 'text',
        fullWidth: true,
        floatingLabelText: 'This is a test textfield component',
    };

    it('renders TextField component', () => {
        const wrapper = setup(testProps);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('renders TextField component appending a class', () => {
        const wrapper = setup({
            ...testProps,
            className: 'requiredField',
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('renders TextField component with shrink:true', () => {
        const wrapper = setup({
            ...testProps,
            floatinglabelfixed: true,
            label: 'test',
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
