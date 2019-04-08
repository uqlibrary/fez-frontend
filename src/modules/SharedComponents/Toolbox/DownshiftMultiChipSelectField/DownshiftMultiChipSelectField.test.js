import DownshiftMultiChipSelectField from './DownshiftMultiChipSelectField';

describe('DownshiftMultiChipSelectField component', () => {
    it('should render properly', () => {
        const wrapper = getElement(
            DownshiftMultiChipSelectField,
            {
                input: {
                    onChange: jest.fn()
                },
                testProp: 'testValue'
            }
        );
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});