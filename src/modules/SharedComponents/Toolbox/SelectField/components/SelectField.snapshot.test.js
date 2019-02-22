import SelectField from './SelectField';

import filterProps from '../../helpers/_filterProps';

function setup(testProps, isShallow = true) {
    const props = {
        name: 'selectfield',
        type: 'text',
        fullWidth: true,
        floatingLabelText: 'test selectfield component',
        ...testProps
    };
    const consolidatedProps = filterProps(props, SelectField.propTypes);
    return getElement(SelectField, consolidatedProps, isShallow);
}

describe('SelectfieldWrapper snapshots tests', () => {
    it('renders SelectField component', () => {
        const props =
            {
                name: 'selectfield',
                type: 'text',
                fullWidth: true,
                floatingLabelText: 'This is a test selectfield component'
            };

        const wrapper = setup(props);
        const tree = toJson(wrapper);
        expect(tree).toMatchSnapshot();
    });

    it ('renders an error', () => {
        const props =
            {
                name: 'selectfield',
                error: true,
                errorText: 'Something bad happened',
            };

        const wrapper = setup(props);
        const tree = toJson(wrapper);
        expect(tree).toMatchSnapshot();
    });

    it ('changes filteredprops when props are changed', () => {
    });
});
