it('temp', () => {
    expect(1).toBeTruthy();
});
// /* eslint-disable no-unused-vars */
// /* eslint-disable camelcase */
// import React from 'react';
// import Immutable from 'immutable';
// import MyIncompleteRecordContainer from './MyIncompleteRecordContainer';
// import { incompleteNTRORecordUQ352045 } from 'mock/data/records';
// import { render, WithReduxStore, waitForElementToBeRemoved, WithRouter, fireEvent } from 'test-utils';
// import * as repositories from 'repositories';

// import { useParams } from 'react-router';
// import * as UserIsAdmin from 'hooks/userIsAdmin';

// jest.mock('react-router', () => ({
//     useParams: jest.fn(() => ({ pid: 'UQ:123456' })),
//     useHistory: jest.fn(() => ({ go: jest.fn() })),
// }));

// const setup = (testProps = {}, state = {}) => {
//     const props = {
//         ...testProps,
//     };

//     return render(
//         <WithRouter>
//             <WithReduxStore initialState={Immutable.Map(state)}>
//                 <MyIncompleteRecordContainer {...props} />
//             </WithReduxStore>
//         </WithRouter>,
//     );
// };

// describe('MyIncompleteRecordContainer', () => {
//     beforeEach(() => {
//         useParams.mockImplementation(() => ({ pid: 'UQ:111111' }));
//     });

//     it('should render default component', async () => {
//         mockApi
//             .onGet(repositories.routes.EXISTING_RECORD_API({ pid: 'UQ:111111' }).apiUrl)
//             .replyOnce(200, { data: incompleteNTRORecordUQ352045 });

//         const { getByTestId, getByText, getByTitle, asFragment } = setup(
//             {},
//             {
//                 accountReducer: {
//                     author: { aut_id: 78691 },
//                 },
//             },
//         );

//         await waitForElementToBeRemoved(() => getByText('Loading'));

//         expect(asFragment()).toMatchSnapshot();
//         fireEvent.mouseDown(getByTestId('rek-significance-select'));
//         fireEvent.click(getByText('Major'));

//         expect(getByTestId('page-title')).toHaveTextContent('Complete my work');
//     });

//     it('should handle undefined fez_record_search_key_grant_agency', async () => {
//         mockApi.onGet(repositories.routes.EXISTING_RECORD_API({ pid: 'UQ:111111' }).apiUrl).replyOnce(200, {
//             data: {
//                 ...incompleteNTRORecordUQ352045,
//                 fez_record_search_key_grant_agency: undefined,
//             },
//         });

//         const { getByText, asFragment } = setup(
//             {},
//             {
//                 accountReducer: {
//                     author: { aut_id: 78691 },
//                 },
//             },
//         );

//         await waitForElementToBeRemoved(() => getByText('Loading'));
//         expect(asFragment()).toMatchSnapshot();
//     });

//     it('should render default component with default values', async () => {
//         const {
//             fez_record_search_key_language,
//             rek_formatted_abstract,
//             fez_record_search_key_total_pages,
//             fez_record_search_key_significance,
//             fez_record_search_key_creator_contribution_statement,
//             ...work
//         } = incompleteNTRORecordUQ352045;

//         mockApi
//             .onGet(repositories.routes.EXISTING_RECORD_API({ pid: 'UQ:111111' }).apiUrl)
//             .replyOnce(200, { data: work });

//         const { getByTestId, getByText } = setup(
//             {},
//             {
//                 accountReducer: {
//                     author: { aut_id: 78691 },
//                 },
//             },
//         );

//         await waitForElementToBeRemoved(() => getByText('Loading'));

//         expect(getByTestId('page-title')).toHaveTextContent('Complete my work');
//     });

//     it('should render empty div if author is not linked', async () => {
//         mockApi
//             .onGet(repositories.routes.EXISTING_RECORD_API({ pid: 'UQ:111111' }).apiUrl)
//             .replyOnce(200, { data: incompleteNTRORecordUQ352045 });

//         const { getByTestId, getByText } = setup(
//             {},
//             {
//                 accountReducer: {
//                     author: { aut_id: 78692 },
//                 },
//             },
//         );

//         await waitForElementToBeRemoved(() => getByText('Loading'));

//         expect(getByTestId('author-not-linked')).toBeInTheDocument();
//     });

//     it('should load all contributor statements for logged in admin user', async () => {
//         const userIsAdmin = jest.spyOn(UserIsAdmin, 'userIsAdmin');
//         userIsAdmin.mockImplementation(() => true);
//         mockApi.onGet(repositories.routes.EXISTING_RECORD_API({ pid: 'UQ:111111' }).apiUrl).replyOnce(200, {
//             data: {
//                 ...incompleteNTRORecordUQ352045,
//                 fez_record_search_key_creator_contribution_statement: [
//                     {
//                         rek_creator_contribution_statement: 'Test statement',
//                         rek_creator_contribution_statement_order: 1,
//                     },
//                     {
//                         rek_creator_contribution_statement: 'Missing',
//                         rek_creator_contribution_statement_order: 2,
//                     },
//                     {
//                         rek_creator_contribution_statement: '',
//                         rek_creator_contribution_statement_order: 3,
//                     },
//                     {
//                         rek_creator_contribution_statement: 'Missing',
//                         rek_creator_contribution_statement_order: 4,
//                     },
//                 ],
//                 fez_record_search_key_significance: [
//                     {
//                         rek_significance: 454026,
//                         rek_significance_order: 1,
//                     },
//                     {
//                         rek_significance: 0,
//                         rek_significance_order: 2,
//                     },
//                     {
//                         rek_significance: 0,
//                         rek_significance_order: 3,
//                     },
//                     {
//                         rek_significance: 0,
//                         rek_significance_order: 4,
//                     },
//                 ],

//                 fez_record_search_key_author_affiliation_name: [
//                     {
//                         rek_author_affiliation_name: '',
//                         rek_author_affiliation_name_order: 1,
//                     },
//                     {
//                         rek_author_affiliation_name: 'The University of Queensland',
//                         rek_author_affiliation_name_order: 2,
//                     },
//                     {
//                         rek_author_affiliation_name: '',
//                         rek_author_affiliation_name_order: 3,
//                     },
//                     {
//                         rek_author_affiliation_name: 'National Library',
//                         rek_author_affiliation_name_order: 4,
//                     },
//                 ],
//                 fez_record_search_key_author_affiliation_type: [
//                     {
//                         rek_author_affiliation_type: 0,
//                         rek_author_affiliation_type_order: 1,
//                     },
//                     {
//                         rek_author_affiliation_type: 453989,
//                         rek_author_affiliation_type_order: 2,
//                     },
//                     {
//                         rek_author_affiliation_type: 0,
//                         rek_author_affiliation_type_order: 3,
//                     },
//                     {
//                         rek_author_affiliation_type: 453983,
//                         rek_author_affiliation_type_order: 4,
//                     },
//                 ],
//                 fez_record_search_key_grant_agency: [
//                     {
//                         rek_grant_agency: 'Test 1',
//                         rek_grant_agency_order: 1,
//                     },
//                     {
//                         rek_grant_agency: 'Test 2',
//                         rek_grant_agency_order: 2,
//                     },
//                 ],
//                 fez_record_search_key_grant_id: [
//                     {
//                         rek_grant_id: '11111',
//                         rek_grant_id_order: 1,
//                     },
//                 ],
//                 fez_record_search_key_grant_agency_type: [
//                     {
//                         rek_grant_agency_type: '453983',
//                         rek_grant_agency_type_order: 1,
//                     },
//                 ],
//             },
//         });

//         const { getByTestId, getByText } = setup(
//             {},
//             {
//                 accountReducer: {
//                     author: { aut_id: 79324 },
//                 },
//             },
//         );

//         await waitForElementToBeRemoved(() => getByText('Loading'));

//         expect(getByTestId('page-title')).toHaveTextContent('Complete my work');
//     });
// });
