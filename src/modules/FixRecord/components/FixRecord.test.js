import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import FixRecord from './FixRecord';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import PropTypes from 'prop-types';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Immutable from 'immutable';
import {journalArticle} from 'mock/data/testing/records';

function setup({initialValues, authorLoading, isShallow = true}){
    const props = {
        authorLoading: authorLoading || false,
        initialValues: initialValues ||
            Immutable.Map({
                publication: Immutable.Map(journalArticle),
                author: Immutable.Map({aut_id: 410})
            }),
        actions: {},
        history: {}
    };

    if(isShallow) {
        return shallow(<FixRecord {...props} />);
    }

    return mount(<FixRecord {...props} />, {
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


describe('Component FixRecord ', () => {
    it('should render loader', () => {
        const wrapper = setup({authorLoading: true});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    // it('should render publication citation, error message if publication has PID and it was claimed by current author already', () => {
    //     const testArticle = {
    //         ...journalArticle,
    //         fez_record_search_key_author_id: [
    //             {
    //                 "rek_author_id": 410,
    //                 "rek_author_id_order": 1
    //             },
    //             {
    //                 "rek_author_id": 0,
    //                 "rek_author_id_order": 2
    //             }
    //         ],
    //         fez_record_search_key_author: [
    //             {
    //                 "rek_author_id": null,
    //                 "rek_author_pid": "UQ:111111",
    //                 "rek_author": "Smith, A",
    //                 "rek_author_order": 1
    //             },
    //             {
    //                 "rek_author_id": null,
    //                 "rek_author_pid": "UQ:222222",
    //                 "rek_author": "Smith, J",
    //                 "rek_author_order": 2
    //             },
    //         ]
    //     };
    //
    //     const wrapper = setup({
    //         initialValues: Immutable.Map(
    //             {
    //                 publication: Immutable.Map(testArticle),
    //                 author: Immutable.Map({aut_id: 410})
    //             }
    //         )
    //     });
    //
    //     expect(wrapper.find('Field').length).toEqual(0);
    //     expect(wrapper.find('RaisedButton').length).toEqual(1);
    //     expect(wrapper.find('Alert').length).toEqual(1);
    //     expect(wrapper.find('PublicationCitation').length).toEqual(1);
    //
    //     expect(toJson(wrapper)).toMatchSnapshot();
    // });
    //
    // it('should render claim form if publication doesn\'t have a PID and but current author was assigned (author linking component should not be rendered)', () => {
    //         const testArticle = {
    //             ...journalArticle,
    //             rek_pid: null,
    //             fez_record_search_key_author_id: [
    //                 {
    //                     "rek_author_id": 410,
    //                     "rek_author_id_order": 1
    //                 },
    //                 {
    //                     "rek_author_id": 0,
    //                     "rek_author_id_order": 2
    //                 }
    //             ],
    //             fez_record_search_key_author: [
    //                 {
    //                     "rek_author_id": null,
    //                     "rek_author_pid": "UQ:111111",
    //                     "rek_author": "Smith, A",
    //                     "rek_author_order": 1
    //                 },
    //                 {
    //                     "rek_author_id": null,
    //                     "rek_author_pid": "UQ:222222",
    //                     "rek_author": "Smith, J",
    //                     "rek_author_order": 2
    //                 },
    //             ]
    //         };
    //
    //     const wrapper = setup({
    //         initialValues: Immutable.Map(
    //             {
    //                 publication: Immutable.Map(testArticle),
    //                 author: Immutable.Map({aut_id: 410})
    //             }
    //         )
    //     });
    //
    //     expect(wrapper.find('Field').length).toEqual(3);
    //     expect(wrapper.find('RaisedButton').length).toEqual(2);
    //     expect(wrapper.find('Alert').length).toEqual(0);
    //     expect(wrapper.find('PublicationCitation').length).toEqual(1);
    //
    //     expect(toJson(wrapper)).toMatchSnapshot();
    // });
    //
    // it('should render claim form, author linking component should not be rendered if there\'s only one author on a publication', () => {
    //     const testArticle = {
    //         ...journalArticle,
    //         rek_pid: null,
    //         fez_record_search_key_author_id: [],
    //         fez_record_search_key_author: [{
    //             "rek_author_id": null,
    //             "rek_author_pid": "UQ:10000",
    //             "rek_author": "Smith, J",
    //             "rek_author_order": 1
    //         }]
    //     };
    //
    //     const wrapper = setup({
    //         initialValues: Immutable.Map(
    //             {
    //                 publication: Immutable.Map(testArticle),
    //                 author: Immutable.Map({aut_id: 410})
    //             }
    //         )
    //     });
    //
    //     expect(wrapper.find('Field').length).toEqual(3);
    //     expect(wrapper.find('RaisedButton').length).toEqual(2);
    //     expect(wrapper.find('Alert').length).toEqual(0);
    //     expect(wrapper.find('PublicationCitation').length).toEqual(1);
    //
    //     expect(toJson(wrapper)).toMatchSnapshot();
    // });
    //
    // it('should render alert message depending on form status', () => {
    //     const wrapper = setup({}).instance();
    //     const testCases = [
    //         {
    //             parameters: {submitFailed: true, error: true, txt: {errorAlert: {title: 'submitFailed' }}},
    //             expected: 'submitFailed'
    //         },
    //         {
    //             parameters: {dirty: true, invalid: true, txt: {validationAlert: {title: 'validationFailed'}}},
    //             expected: 'validationFailed'
    //         },
    //         {
    //             parameters: {submitting: true, txt: {progressAlert: {title: 'submitting' }}},
    //             expected: 'submitting'
    //         },
    //         {
    //             parameters: {submitSucceeded: true, txt: {successAlert: {title: 'submitSucceeded' }}},
    //             expected: 'submitSucceeded'
    //         },
    //         {
    //             parameters: {authorLinked: true, txt: {alreadyClaimedAlert: {title: 'alreadyClaimed' }}},
    //             expected: 'alreadyClaimed'
    //         }
    //     ];
    //
    //     testCases.forEach(testCase => {
    //         const alert = wrapper.getAlert({...testCase.parameters});
    //         expect(alert.props.title).toEqual(testCase.expected);
    //     });
    // });
    //
    // it('should not render any alerts if not required', () => {
    //     const wrapper = setup({}).instance();
    //     const noAlert = wrapper.getAlert({});
    //     expect(noAlert).toEqual(null);
    //
    // });
});
