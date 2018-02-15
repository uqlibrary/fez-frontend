import ThesisSubmissionContainer from './ThesisSubmission';
import Immutable from 'immutable';

function setup(testProps, isShallow = true) {
    const props = {
        ...testProps
    };

    return getElement(ThesisSubmissionContainer, props, isShallow);
}

describe('ThesisSubmissionContainer', () => {
    it('form validation should return 11 errors for empty form', () => {
        const wrapper = setup({}, false);
        const allErrors = wrapper.find('Connect(Form(ConfirmDiscardFormChanges))').props().validate(Immutable.Map({}));
        expect(allErrors._error.length).toEqual(11);
    });

    it('form validation should return no errors for filled out form', () => {
        const wrapper = setup({}, false);

        const data = {
            "currentAuthor": [{"nameAsPublished": "HDR Student, N", "authorId": 44444}],
            "fez_record_search_key_ismemberof": [{"rek_ismemberof": "UQ:152694"}],
            "supervisors": [
                {"nameAsPublished": "A Test", "disabled": false},
                {"nameAsPublished": "B Test", "disabled": false
            }],
            "fieldOfResearch": [
                {"rek_value": {"key": 451799, "value": "01 Mathematical Sciences"}, "rek_order": 1},
                {"rek_value": {"key": 451800, "value": "0101 Pure Mathematics"}, "rek_order": 2}
            ],
            "thesisAbstract": {
                plainText: "abstract",
                formattedText: "<p>abstract</p>"
            },
            "thesisTitle": {
                plainText: "title",
                formattedText: "<p>title</p>"
            },
            "fez_record_search_key_org_name": {"rek_org_name": "The University of Queensland"},
            "rek_object_type": 3,
            "rek_date": "2010-01-01",
            "fez_record_search_key_keywords": [
                {"rek_keywords": "one", "rek_keywords_order": 1},
                {"rek_keywords": "two", "rek_keywords_order": 2}
            ],
            "files": {"queue": [{name: "file.txt"}], "isValid": true},
            "rek_status": 2,
            "rek_genre_type": "B.Sc Thesis",
            "rek_display_type": 187,
            "fez_record_search_key_org_unit_name": {"rek_org_unit_name": "School of Engineering"}
        };
        const allErrors = wrapper.find('Connect(Form(ConfirmDiscardFormChanges))').props().validate(Immutable.Map(data));
        expect(allErrors).toBeNull();
    });
});
