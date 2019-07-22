import { DigiTeamBatchImport } from './DigiTeamBatchImport';
import Immutable from 'immutable';

function setup(testProps, isShallow = true) {
    const props = {
        formValues: testProps.initialValues ? Immutable.Map(testProps.initialValues) : Immutable.Map({}),
    };
    return getElement(DigiTeamBatchImport, props, isShallow);
}

describe('Component DigiTeamBatchImport', () => {
    it('renders initial page', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    // it('render collection selector when community selected try 1', () => {
    //     const wrapper = setup({
    //     });
    //     wrapper
    //         .find('WithStyles(Field)')
    //         // .props()
    //         .onChange({ target: { value: 316 } });
    //     expect(toJson(wrapper)).toMatchSnapshot();
    // });

    it('render collection selector when community selected', () => {
        const testProps = {
            formValues: {
                get: () => ({
                    toJS: () => ({
                        communityID: 316,
                    }),
                }),
                // get: (key) => {
                //     const values = {
                //         'communityID': 316,
                //     };
                //     return values[key];
                // },
            },
        };
        const wrapper = setup(testProps);
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
