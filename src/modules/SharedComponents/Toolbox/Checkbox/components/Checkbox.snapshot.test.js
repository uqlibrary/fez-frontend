import Checkbox from './Checkbox';
import filterProps from '../../helpers/_filterProps';

function setup(testProps, isShallow = true) {
    const props = filterProps(testProps, Checkbox.propTypes);
    return getElement(Checkbox, {...props}, isShallow);
}

describe('Checkbox snapshots tests', () => {
    it('renders Checkbox component', () => {
        const props = { label: 'This is a test checkbox component'};
        const wrapper = setup(props);
        const tree = toJson(wrapper);
        expect(tree).toMatchSnapshot();
    });
});
