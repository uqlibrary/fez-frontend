import MyIncompleteRecordForm, { onSubmit, validate } from './MyIncompleteRecordForm';
import { UQ352045 } from 'mock/data/records';
import { Map } from 'immutable';

jest.mock('actions', () => ({
    updateIncompleteRecord: (data) => (
        data.author.aut_id === 410
            ? Promise.resolve()
            : Promise.reject(Error('Some error'))
    )
}));

function setup(testProps, isShallow = true) {
    const props = {
        ...testProps
    };

    return getElement(MyIncompleteRecordForm, props, isShallow);
}

describe('MyIncompleteRecordForm', () => {
    it('should mount the component with redux-form', () => {
        const wrapper = setup({
            recordToFix: UQ352045,
            author: {aut_id: 411},
            isNtro: true,
            hasAnyFiles: true,
            ntroFieldProps: {
                hideAbstract: true,
                hideAudienceSize: false,
                hideExtent: true,
                hideLanguage: true,
                hidePeerReviewActivity: true,
                showContributionStatement: false,
                showSignificance: true
            },
            isAuthorLinked: true,
            history: {
                push: jest.fn(),
                go: jest.fn()
            }
        });

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should resolve onSubmit()', () => {
        const testValue = new Map({
            significance: '11111',
            impactStatement: {
                htmlText: '<p>test</p>'
            }
        });
        const dispatch = jest.fn(promise => promise);
        const props = {
            author: {
                aut_id: 410
            },
            publication: {
                pid: {}
            }
        };

        onSubmit(testValue, dispatch, props);
        expect(dispatch).toHaveBeenCalled();
    });

    it('should reject onSubmit()', () => {
        const testValue = new Map({
            significance: '11111',
            impactStatement: {
                htmlText: '<p>test</p>'
            }
        });
        const dispatch = jest.fn(promise => promise);
        const props = {
            author: {
                aut_id: 400
            },
            publication: {
                pid: {}
            }
        };

        try {
            onSubmit(testValue, dispatch, props);
        } catch (error) {
            expect(dispatch).toHaveBeenCalled();
            expect(error).toBeInstanceOf('SubmissionError');
            expect(error._error).toEqual('Some error');
        }
    });

    it('should validate() and return empty object', () => {
        const errors = validate(new Map({}), { author: { aut_id: 410 }});
        expect(errors).toEqual({});
    });

    it('should validate() and return author affiliation error', () => {
        const values = new Map({
            authorsAffiliation: [{
                "affiliation": "NotUQ",
                "creatorRole": "",
                "disabled": false,
                "nameAsPublished": "Test",
                "orgaff": "",
                "orgtype": "",
                "required": true,
                "uqIdentifier": "0",
            }]
        });

        const errors = validate(values, { author: { aut_id: 410 }})
        expect(errors).toEqual({
            authorsAffiliation: 'Rows marked with a red prefix must be updated'
        });
    });
});
