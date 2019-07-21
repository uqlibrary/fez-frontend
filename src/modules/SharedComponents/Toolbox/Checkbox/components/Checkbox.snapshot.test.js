import Checkbox from './Checkbox';
import filterProps from '../../helpers/_filterProps';

function setup(testProps = {}) {
    const props = filterProps(testProps, Checkbox.propTypes);
    return getElement(Checkbox, { ...props, ...testProps });
}

describe('Checkbox snapshots tests', () => {
    it('renders Checkbox component', () => {
        const props = { label: 'This is a test checkbox component' };
        const wrapper = setup(props);
        const tree = toJson(wrapper);
        expect(tree).toMatchSnapshot();
    });

    it('should call onChange function', () => {
        const onChangeFn = jest.fn();
        const wrapper = setup({
            label: 'This is a test',
            input: {
                onChange: onChangeFn,
            },
        });
        expect(toJson(wrapper)).toMatchSnapshot();
        wrapper
            .find('WithStyles(Checkbox)')
            .props()
            .onChange();
        expect(onChangeFn).toHaveBeenCalled();
    });

    it('should render correct class for error', () => {
        const wrapper = setup({
            label: 'This is a test',
            meta: {
                error: 'test error',
            },
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
