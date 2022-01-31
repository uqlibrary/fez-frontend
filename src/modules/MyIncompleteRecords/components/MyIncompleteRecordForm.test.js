import MyIncompleteRecordForm, { onSubmit, validate } from './MyIncompleteRecordForm';
import { incompleteNTRORecordUQ352045 } from 'mock/data/records';
import { Map } from 'immutable';
import { SubmissionError } from 'redux-form';
import { AFFILIATION_TYPE_NOT_UQ } from 'config/general';

jest.mock('actions', () => ({
    updateIncompleteRecord: data =>
        data.author.aut_id === 410 ? Promise.resolve() : Promise.reject(Error('Some error')),
}));

function setup(testProps = {}) {
    const props = {
        ...testProps,
    };

    return getElement(MyIncompleteRecordForm, props);
}

describe('MyIncompleteRecordForm', () => {
    it('should mount the component with redux-form', () => {
        const wrapper = setup({
            recordToFix: incompleteNTRORecordUQ352045,
            author: { aut_id: 411 },
            isNtro: true,
            hasAnyFiles: true,
            ntroFieldProps: {
                hideAbstract: true,
                hideAudienceSize: false,
                hideExtent: true,
                hideLanguage: true,
                hidePeerReviewActivity: true,
                showContributionStatement: false,
                showSignificance: true,
            },
            isAuthorLinked: true,
            history: {
                push: jest.fn(),
                go: jest.fn(),
            },
        });

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should resolve onSubmit()', () => {
        const testValue = new Map({
            significance: '11111',
            impactStatement: {
                htmlText: '<p>test</p>',
            },
        });
        const dispatch = jest.fn(promise => promise);
        const props = {
            author: {
                aut_id: 410,
            },
            publication: {
                pid: {},
            },
        };

        onSubmit(testValue, dispatch, props);
        expect(dispatch).toHaveBeenCalled();
    });

    it('should reject onSubmit()', async () => {
        const testValue = new Map({
            significance: '11111',
            impactStatement: {
                htmlText: '<p>test</p>',
            },
        });
        const dispatch = jest.fn(promise => promise);
        const props = {
            author: {
                aut_id: 400,
            },
            publication: {
                pid: {},
            },
        };

        await expect(onSubmit(testValue, dispatch, props)).rejects.toThrow(
            new SubmissionError('Submit Validation Failed'),
        );
    });

    it('should validate() and return empty object', () => {
        const errors = validate(new Map({}), { author: { aut_id: 410 } });
        expect(errors).toEqual({});
    });

    it('should validate() and return author affiliation error', () => {
        const values = new Map({
            authorsAffiliation: [
                {
                    affiliation: AFFILIATION_TYPE_NOT_UQ,
                    creatorRole: '',
                    disabled: false,
                    nameAsPublished: 'Test',
                    orgaff: '',
                    orgtype: '',
                    required: true,
                    uqIdentifier: '0',
                },
            ],
        });

        const errors = validate(values, { author: { aut_id: 410 } });
        expect(errors).toEqual({
            authorsAffiliation: 'Rows marked with a red prefix must be updated',
        });
    });
});
