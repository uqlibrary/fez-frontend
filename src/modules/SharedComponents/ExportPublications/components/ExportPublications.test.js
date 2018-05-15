import ExportPublications from './ExportPublications';
import {formatToFileInfoMap} from "../../../../actions/publicationDataTransformers";

function setup(testProps, isShallow = true) {
    const props = {
        format: testProps.format,
        ...testProps
    };
    return getElement(ExportPublications, props, isShallow);
}

describe('Export Publications renders', () => {
    it('component with all fields enabled', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
        const format = wrapper.find('SelectField');
        expect(format.length).toBe(1);
    });

    // it('component with field selected', () => {
    //     const expected = Object.keys(formatToFileInfoMap)[0];
    //     const wrapper = setup({
    //         format: expected
    //     });
    //     expect(toJson(wrapper)).toMatchSnapshot();
    //     const format = wrapper.find('SelectField');
    //     expect(format.length).toBe(1);
    //     expect(format[0].value).toEqual(expected);
    // });

    it('component with all fields disabled', () => {
        const wrapper = setup({disabled: true});
        wrapper.find('SelectField').forEach(option => {
            expect(option.props().disabled).toEqual(true);
        })
    });
});
