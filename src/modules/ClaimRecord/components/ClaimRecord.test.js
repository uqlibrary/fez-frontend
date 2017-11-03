jest.dontMock('./ClaimRecord');

import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import ClaimRecord from './ClaimRecord';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import PropTypes from 'prop-types';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Immutable from 'immutable';
import {journalArticle} from 'mock/data/testing/records';

function setup({initialValues, history, handleSubmit = jest.fn(), actions, isShallow = true}){
    const props = {
        initialValues: initialValues ||
            Immutable.Map({
                publication: Immutable.Map(journalArticle),
                author: Immutable.Map({aut_id: 410})
            }),
        handleSubmit: handleSubmit,
        actions: actions || {},
        history: history || {}
    };

    if(isShallow) {
        return shallow(<ClaimRecord {...props} />);
    }

    return mount(<ClaimRecord {...props} />, {
        context: {
            muiTheme: getMuiTheme()
        },
        childContextTypes: {
            muiTheme: PropTypes.object.isRequired
        }
    });

}

beforeAll(() => {
    injectTapEventPlugin();
});


describe('Component ClaimRecord ', () => {
    it('should render claim publication form', () => {
        const wrapper = setup({});
        expect(wrapper.find('Field').length).toEqual(4);
        expect(wrapper.find('RaisedButton').length).toEqual(2);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render publication citation, error message if publication has PID and it was claimed by current author already', () => {
        const testArticle = {
            ...journalArticle,
            fez_record_search_key_author_id: [
                {
                    "rek_author_id": 410,
                    "rek_author_id_order": 1
                },
                {
                    "rek_author_id": 0,
                    "rek_author_id_order": 2
                }
            ],
            fez_record_search_key_author: [
                {
                    "rek_author_id": null,
                    "rek_author_pid": "UQ:111111",
                    "rek_author": "Smith, A",
                    "rek_author_order": 1
                },
                {
                    "rek_author_id": null,
                    "rek_author_pid": "UQ:222222",
                    "rek_author": "Smith, J",
                    "rek_author_order": 2
                },
            ]
        };

        const wrapper = setup({
            initialValues: Immutable.Map(
                {
                    publication: Immutable.Map(testArticle),
                    author: Immutable.Map({aut_id: 410})
                }
            )
        });

        expect(wrapper.find('Field').length).toEqual(0);
        expect(wrapper.find('RaisedButton').length).toEqual(1);
        expect(wrapper.find('Alert').length).toEqual(1);
        expect(wrapper.find('withRouter(Connect(PublicationCitation))').length).toEqual(1);

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render claim form if publication doesn\'t have a PID and but current author was assigned (author linking component should not be rendered)', () => {
            const testArticle = {
                ...journalArticle,
                rek_pid: null,
                fez_record_search_key_author_id: [
                    {
                        "rek_author_id": 410,
                        "rek_author_id_order": 1
                    },
                    {
                        "rek_author_id": 0,
                        "rek_author_id_order": 2
                    }
                ],
                fez_record_search_key_author: [
                    {
                        "rek_author_id": null,
                        "rek_author_pid": "UQ:111111",
                        "rek_author": "Smith, A",
                        "rek_author_order": 1
                    },
                    {
                        "rek_author_id": null,
                        "rek_author_pid": "UQ:222222",
                        "rek_author": "Smith, J",
                        "rek_author_order": 2
                    },
                ]
            };

        const wrapper = setup({
            initialValues: Immutable.Map(
                {
                    publication: Immutable.Map(testArticle),
                    author: Immutable.Map({aut_id: 410})
                }
            )
        });

        expect(wrapper.find('Field').length).toEqual(3);
        expect(wrapper.find('RaisedButton').length).toEqual(2);
        expect(wrapper.find('Alert').length).toEqual(0);
        expect(wrapper.find('withRouter(Connect(PublicationCitation))').length).toEqual(1);

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render claim form, author linking component should not be rendered if there\'s only one author on a publication', () => {
        const testArticle = {
            ...journalArticle,
            rek_pid: null,
            fez_record_search_key_author_id: [],
            fez_record_search_key_author: [{
                "rek_author_id": null,
                "rek_author_pid": "UQ:10000",
                "rek_author": "Smith, J",
                "rek_author_order": 1
            }]
        };

        const wrapper = setup({
            initialValues: Immutable.Map(
                {
                    publication: Immutable.Map(testArticle),
                    author: Immutable.Map({aut_id: 410})
                }
            )
        });

        expect(wrapper.find('Field').length).toEqual(3);
        expect(wrapper.find('RaisedButton').length).toEqual(2);
        expect(wrapper.find('Alert').length).toEqual(0);
        expect(wrapper.find('withRouter(Connect(PublicationCitation))').length).toEqual(1);

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render alert message depending on form status', () => {
        const wrapper = setup({}).instance();
        const testCases = [
            {
                parameters: {submitFailed: true, error: true, txt: {errorAlert: {title: 'submitFailed' }}},
                expected: 'submitFailed'
            },
            {
                parameters: {dirty: true, invalid: true, txt: {validationAlert: {title: 'validationFailed'}}},
                expected: 'validationFailed'
            },
            {
                parameters: {submitting: true, txt: {progressAlert: {title: 'submitting' }}},
                expected: 'submitting'
            },
            {
                parameters: {submitSucceeded: true, txt: {successAlert: {title: 'submitSucceeded' }}},
                expected: 'submitSucceeded'
            },
            {
                parameters: {authorLinked: true, txt: {alreadyClaimedAlert: {title: 'alreadyClaimed' }}},
                expected: 'alreadyClaimed'
            }
        ];

        testCases.forEach(testCase => {
            const alert = wrapper.getAlert({...testCase.parameters});
            expect(alert.props.title).toEqual(testCase.expected);
        });
    });

    it('should not render any alerts if not required', () => {
        const wrapper = setup({}).instance();
        const noAlert = wrapper.getAlert({});
        expect(noAlert).toEqual(null);
    });

    it('should set local variables', () => {
        const wrapper = setup({});
        wrapper.setState({selectedRecordAction: 'unclaim'});
        wrapper.instance()._setSuccessConfirmation('successBox');
        expect(wrapper.instance().successConfirmationBox).toEqual('successBox');

        wrapper.instance()._setCancelConfirmation('cancelBox');
        expect(wrapper.instance().cancelConfirmationBox).toEqual('cancelBox');
    });

    it('should submit form when user hits Enter', () => {
        const testMethod = jest.fn();
        const wrapper = setup({handleSubmit: testMethod});

        wrapper.instance()._handleKeyboardFormSubmit({key: 'Enter', shiftKey: false, preventDefault: jest.fn()});
        expect(testMethod).toHaveBeenCalled();

    });

    it('should not submit form when user hits shift+Enter', () => {
        const testMethod = jest.fn();
        const wrapper = setup({handleSubmit: testMethod});

        wrapper.instance()._handleKeyboardFormSubmit({key: 'Enter', shiftKey: true, preventDefault: jest.fn()});
        expect(testMethod).not.toHaveBeenCalled();
    });

    it('should redirect if no author or record set', () => {
        const testMethod = jest.fn();
        const wrapper = setup({initialValues: Immutable.Map({author: null}), history: {go: testMethod}});
        expect(testMethod).toHaveBeenCalled();
    });

    // if (this.props.pristine) {
    //     if (!!this.props.initialValues.get('publication').get('sources')) {
    //         this._navigateToAddRecord();
    //     } else {
    //         this._navigateToPossibleMyResearch();
    //     }
    // } else {
    //     this.cancelConfirmationBox.showConfirmation();
    // }
    //

    it('should display confirmation box after successful submission', () => {
        const testMethod = jest.fn();
        const wrapper = setup({});
        wrapper.instance().successConfirmationBox = {showConfirmation: testMethod};
        wrapper.instance().componentWillReceiveProps({submitSucceeded: true});
        expect(testMethod).toHaveBeenCalled();
    });


    it('should clear record to fix when leaving the form', () => {
        const actionFunction = jest.fn();
        const wrapper = setup({actions: {clearClaimPublication: actionFunction}});
        wrapper.instance().componentWillUnmount();
        expect(actionFunction).toHaveBeenCalled();
    });

    it('should redirect to other pages', () => {
        const testMethod = jest.fn();

        const wrapper = setup({history: {push: testMethod}});
        wrapper.instance()._navigateToMyResearch();
        expect(testMethod).toHaveBeenCalledWith('/records/mine');

        wrapper.instance()._navigateToPossibleMyResearch();
        expect(testMethod).toHaveBeenCalledWith('/records/possible');

        wrapper.instance()._navigateToAddRecord();
        expect(testMethod).toHaveBeenCalledWith('/records/add/find');
    });

    it('should render navigation prompt', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();

        wrapper.setProps({dirty: true});
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
