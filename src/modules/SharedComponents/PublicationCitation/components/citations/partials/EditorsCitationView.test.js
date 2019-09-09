import EditorsCitationView from './EditorsCitationView';

function setup(testProps = {}) {
    const props = {
        classes: {},
        ...testProps,
        publication: testProps.publication || {},
    };
    return getElement(EditorsCitationView, props);
}

describe('EditorsCitationView test ', () => {
    it('should render component with no contributors', () => {
        const wrapper = setup();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with one contributor', () => {
        const testObject = {
            fez_record_search_key_contributor: [
                {
                    rek_contributor_id: null,
                    rek_contributor_pid: 'UQ:678742',
                    rek_contributor: 'Pedroso, Marcelo Monteiro',
                    rek_contributor_order: 1,
                },
            ],
        };
        const wrapper = setup({ publication: testObject });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with two contributors', () => {
        const testObject = {
            fez_record_search_key_contributor: [
                {
                    rek_contributor_id: null,
                    rek_contributor_pid: 'UQ:678742',
                    rek_contributor: 'Pedroso, Marcelo Monteiro',
                    rek_contributor_order: 1,
                },
                {
                    rek_contributor_id: null,
                    rek_contributor_pid: 'UQ:678742',
                    rek_contributor: 'Smith, J',
                    rek_contributor_order: 2,
                },
            ],
        };
        const wrapper = setup({ publication: testObject });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with three contributors', () => {
        const testObject = {
            fez_record_search_key_contributor: [
                {
                    rek_contributor_id: null,
                    rek_contributor_pid: 'UQ:678742',
                    rek_contributor: 'Pedroso, Marcelo Monteiro',
                    rek_contributor_order: 1,
                },
                {
                    rek_contributor_id: null,
                    rek_contributor_pid: 'UQ:678742',
                    rek_contributor: 'Smith, J',
                    rek_contributor_order: 2,
                },
                {
                    rek_contributor_id: null,
                    rek_contributor_pid: 'UQ:678742',
                    rek_contributor: 'Andersen, J',
                    rek_contributor_order: 3,
                },
            ],
        };
        const wrapper = setup({ publication: testObject });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
