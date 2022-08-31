jest.dontMock('./ConferencePaperForm');
import ConferencePaperForm from './ConferencePaperForm';

function setup(testProps = {}) {
    const props = {
        ...testProps,
        submitting: testProps.submitting || false, // : PropTypes.bool,
        subtypeVocabId: testProps.subtypeVocabId || 0, // : PropTypes.number
    };
    return getElement(ConferencePaperForm, props);
}

describe('ConferencePaperForm renders ', () => {
    it('component', () => {
        const wrapper = setup();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('component with 17 input fields', () => {
        const wrapper = setup();
        expect(wrapper.find('Field').length).toEqual(17);
    });

    it('component with all fields disabled', () => {
        const wrapper = setup({ submitting: true });
        wrapper.find('Field').forEach(field => {
            expect(field.props().disabled).toEqual(true);
        });
    });

    it('should normalize the issn input value', () => {
        const wrapper = setup();
        expect(wrapper.instance().normalizeIssn('12345678')).toEqual('1234-5678');
        expect(wrapper.instance().normalizeIssn('1234-5678')).toEqual('1234-5678');
        expect(wrapper.instance().normalizeIssn('1234')).toEqual('1234');
    });

    it('should transform the issn output value', () => {
        const wrapper = setup();
        expect(
            wrapper.instance().transformIssn({ value: 'rek_issn', order: 'rek_issn_order' }, { key: '1234-5678' }, 3),
        ).toEqual({ rek_issn: '1234-5678', rek_issn_order: 4 });
    });
});
