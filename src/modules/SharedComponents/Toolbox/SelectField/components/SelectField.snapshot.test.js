import SelectField from './SelectField';

import filterProps from '../../helpers/_filterProps';

function setup(testProps, isShallow = true) {
    const props = {
        name: 'selectfield',
        type: 'text',
        fullWidth: true,
        floatingLabelText: 'test selectfield component',
        selectFieldId: 'test',
        ...testProps,
    };
    const consolidatedProps = filterProps(props, SelectField.propTypes);
    return getElement(SelectField, { ...consolidatedProps, ...props }, isShallow);
}

describe('SelectfieldWrapper snapshots tests', () => {
    it('renders SelectField component', () => {
        const props = {
            name: 'selectfield',
            type: 'text',
            fullWidth: true,
            floatingLabelText: 'This is a test selectfield component',
        };

        const wrapper = setup(props);
        const tree = toJson(wrapper);
        expect(tree).toMatchSnapshot();
    });

    it('renders an error', () => {
        const props = {
            name: 'selectfield',
            error: true,
            errorText: 'Something bad happened',
        };

        const wrapper = setup(props);
        const tree = toJson(wrapper);
        expect(tree).toMatchSnapshot();
    });

    it('should call onChange', () => {
        const onChangeFn = jest.fn();
        const onBlurFn = jest.fn();
        const wrapper = setup({
            input: {
                onChange: onChangeFn,
                onBlur: onBlurFn,
                value: 'testing',
            },
        });

        wrapper
            .find('WithStyles(ForwardRef(Select))')
            .props()
            .onChange({ target: { value: 'test' } });
        expect(onChangeFn).toHaveBeenCalledWith('test');

        wrapper
            .find('WithStyles(ForwardRef(Select))')
            .props()
            .onBlur();
        expect(onBlurFn).toHaveBeenCalledWith('testing');
    });
});
