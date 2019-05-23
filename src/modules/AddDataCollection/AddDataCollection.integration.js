/* eslint-disable */
import React from 'react';
import * as repositories from 'repositories';
import AddDataCollection from './containers/AddDataCollection';
import {fireEvent, waitForElement, cleanup, renderWithRouter, withRedux} from 'test-utils';
import {searchKeyList} from 'mock/data';

const returnedApiData = {
    "total": 2,
    "data": [
        {
            "cvr_id": 2931,
            "cvr_parent_cvo_id": 451780,
            "cvr_child_cvo_id": 451799,
            "controlled_vocab": {
                "cvo_id": 451799,
                "cvo_title": "01 Mathematical Sciences",
                "cvo_desc": "",
                "cvo_image_filename": null,
                "cvo_external_id": "01",
                "cvo_hide": 0,
                "cvo_order": null,
                "cvo_lat": null,
                "cvo_long": null,
                "cvo_policy": null,
                "controlled_vocab_children": [
                    {
                        "cvr_id": 2932,
                        "cvr_parent_cvo_id": 451799,
                        "cvr_child_cvo_id": 451800,
                        "controlled_vocab": {
                            "cvo_id": 451800,
                            "cvo_title": "0101 Pure Mathematics",
                            "cvo_desc": "",
                            "cvo_image_filename": null,
                            "cvo_external_id": "0101",
                            "cvo_hide": 0,
                            "cvo_order": null,
                            "cvo_lat": null,
                            "cvo_long": null,
                            "cvo_policy": null,
                            "controlled_vocab_children": [
                                {
                                    "cvr_id": 2933,
                                    "cvr_parent_cvo_id": 451800,
                                    "cvr_child_cvo_id": 451801,
                                    "controlled_vocab": {
                                        "cvo_id": 451801,
                                        "cvo_title": "010101 Algebra and Number Theory",
                                        "cvo_desc": "",
                                        "cvo_image_filename": null,
                                        "cvo_external_id": "010101",
                                        "cvo_hide": 0,
                                        "cvo_order": null,
                                        "cvo_lat": null,
                                        "cvo_long": null,
                                        "cvo_policy": null,
                                        "controlled_vocab_children": []
                                    }
                                },
                                {
                                    "cvr_id": 2934,
                                    "cvr_parent_cvo_id": 451800,
                                    "cvr_child_cvo_id": 451802,
                                    "controlled_vocab": {
                                        "cvo_id": 451802,
                                        "cvo_title": "010102 Algebraic and Differential Geometry",
                                        "cvo_desc": "",
                                        "cvo_image_filename": null,
                                        "cvo_external_id": "010102",
                                        "cvo_hide": 0,
                                        "cvo_order": null,
                                        "cvo_lat": null,
                                        "cvo_long": null,
                                        "cvo_policy": null,
                                        "controlled_vocab_children": []
                                    }
                                },
                                {
                                    "cvr_id": 2935,
                                    "cvr_parent_cvo_id": 451800,
                                    "cvr_child_cvo_id": 451803,
                                    "controlled_vocab": {
                                        "cvo_id": 451803,
                                        "cvo_title": "010103 Category Theory, K Theory, Homological Algebra",
                                        "cvo_desc": "",
                                        "cvo_image_filename": null,
                                        "cvo_external_id": "010103",
                                        "cvo_hide": 0,
                                        "cvo_order": null,
                                        "cvo_lat": null,
                                        "cvo_long": null,
                                        "cvo_policy": null,
                                        "controlled_vocab_children": []
                                    }
                                },
                                {
                                    "cvr_id": 2936,
                                    "cvr_parent_cvo_id": 451800,
                                    "cvr_child_cvo_id": 451804,
                                    "controlled_vocab": {
                                        "cvo_id": 451804,
                                        "cvo_title": "010104 Combinatorics and Discrete Mathematics (excl. Physical Combinatorics)",
                                        "cvo_desc": "",
                                        "cvo_image_filename": null,
                                        "cvo_external_id": "010104",
                                        "cvo_hide": 0,
                                        "cvo_order": null,
                                        "cvo_lat": null,
                                        "cvo_long": null,
                                        "cvo_policy": null,
                                        "controlled_vocab_children": []
                                    }
                                },
                                {
                                    "cvr_id": 2937,
                                    "cvr_parent_cvo_id": 451800,
                                    "cvr_child_cvo_id": 451805,
                                    "controlled_vocab": {
                                        "cvo_id": 451805,
                                        "cvo_title": "010105 Group Theory and Generalisations",
                                        "cvo_desc": "",
                                        "cvo_image_filename": null,
                                        "cvo_external_id": "010105",
                                        "cvo_hide": 0,
                                        "cvo_order": null,
                                        "cvo_lat": null,
                                        "cvo_long": null,
                                        "cvo_policy": null,
                                        "controlled_vocab_children": []
                                    }
                                },
                                {
                                    "cvr_id": 2938,
                                    "cvr_parent_cvo_id": 451800,
                                    "cvr_child_cvo_id": 451806,
                                    "controlled_vocab": {
                                        "cvo_id": 451806,
                                        "cvo_title": "010106 Lie Groups, Harmonic and Fourier Analysis",
                                        "cvo_desc": "",
                                        "cvo_image_filename": null,
                                        "cvo_external_id": "010106",
                                        "cvo_hide": 0,
                                        "cvo_order": null,
                                        "cvo_lat": null,
                                        "cvo_long": null,
                                        "cvo_policy": null,
                                        "controlled_vocab_children": []
                                    }
                                },
                                {
                                    "cvr_id": 2939,
                                    "cvr_parent_cvo_id": 451800,
                                    "cvr_child_cvo_id": 451807,
                                    "controlled_vocab": {
                                        "cvo_id": 451807,
                                        "cvo_title": "010107 Mathematical Logic, Set Theory, Lattices and Universal Algebra",
                                        "cvo_desc": "",
                                        "cvo_image_filename": null,
                                        "cvo_external_id": "010107",
                                        "cvo_hide": 0,
                                        "cvo_order": null,
                                        "cvo_lat": null,
                                        "cvo_long": null,
                                        "cvo_policy": null,
                                        "controlled_vocab_children": []
                                    }
                                },
                                {
                                    "cvr_id": 2940,
                                    "cvr_parent_cvo_id": 451800,
                                    "cvr_child_cvo_id": 451808,
                                    "controlled_vocab": {
                                        "cvo_id": 451808,
                                        "cvo_title": "010108 Operator Algebras and Functional Analysis",
                                        "cvo_desc": "",
                                        "cvo_image_filename": null,
                                        "cvo_external_id": "010108",
                                        "cvo_hide": 0,
                                        "cvo_order": null,
                                        "cvo_lat": null,
                                        "cvo_long": null,
                                        "cvo_policy": null,
                                        "controlled_vocab_children": []
                                    }
                                },
                                {
                                    "cvr_id": 2941,
                                    "cvr_parent_cvo_id": 451800,
                                    "cvr_child_cvo_id": 451809,
                                    "controlled_vocab": {
                                        "cvo_id": 451809,
                                        "cvo_title": "010109 Ordinary Differential Equations, Difference Equations and Dynamical Systems",
                                        "cvo_desc": "",
                                        "cvo_image_filename": null,
                                        "cvo_external_id": "010109",
                                        "cvo_hide": 0,
                                        "cvo_order": null,
                                        "cvo_lat": null,
                                        "cvo_long": null,
                                        "cvo_policy": null,
                                        "controlled_vocab_children": []
                                    }
                                },
                                {
                                    "cvr_id": 2942,
                                    "cvr_parent_cvo_id": 451800,
                                    "cvr_child_cvo_id": 451810,
                                    "controlled_vocab": {
                                        "cvo_id": 451810,
                                        "cvo_title": "010110 Partial Differential Equations",
                                        "cvo_desc": "",
                                        "cvo_image_filename": null,
                                        "cvo_external_id": "010110",
                                        "cvo_hide": 0,
                                        "cvo_order": null,
                                        "cvo_lat": null,
                                        "cvo_long": null,
                                        "cvo_policy": null,
                                        "controlled_vocab_children": []
                                    }
                                },
                                {
                                    "cvr_id": 2943,
                                    "cvr_parent_cvo_id": 451800,
                                    "cvr_child_cvo_id": 451811,
                                    "controlled_vocab": {
                                        "cvo_id": 451811,
                                        "cvo_title": "010111 Real and Complex Functions (incl. Several Variables)",
                                        "cvo_desc": "",
                                        "cvo_image_filename": null,
                                        "cvo_external_id": "010111",
                                        "cvo_hide": 0,
                                        "cvo_order": null,
                                        "cvo_lat": null,
                                        "cvo_long": null,
                                        "cvo_policy": null,
                                        "controlled_vocab_children": []
                                    }
                                },
                                {
                                    "cvr_id": 2944,
                                    "cvr_parent_cvo_id": 451800,
                                    "cvr_child_cvo_id": 451812,
                                    "controlled_vocab": {
                                        "cvo_id": 451812,
                                        "cvo_title": "010112 Topology",
                                        "cvo_desc": "",
                                        "cvo_image_filename": null,
                                        "cvo_external_id": "010112",
                                        "cvo_hide": 0,
                                        "cvo_order": null,
                                        "cvo_lat": null,
                                        "cvo_long": null,
                                        "cvo_policy": null,
                                        "controlled_vocab_children": []
                                    }
                                },
                                {
                                    "cvr_id": 2945,
                                    "cvr_parent_cvo_id": 451800,
                                    "cvr_child_cvo_id": 451813,
                                    "controlled_vocab": {
                                        "cvo_id": 451813,
                                        "cvo_title": "010199 Pure Mathematics not elsewhere classified",
                                        "cvo_desc": "",
                                        "cvo_image_filename": null,
                                        "cvo_external_id": "010199",
                                        "cvo_hide": 0,
                                        "cvo_order": null,
                                        "cvo_lat": null,
                                        "cvo_long": null,
                                        "cvo_policy": null,
                                        "controlled_vocab_children": []
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        }
    ]
};

describe('AddDataCollection form', () => {
    afterEach(cleanup);
    it('should allow user to submit the form', async () => {
        const testId = 451780;

        mockApi
            .onGet(repositories.routes.SEARCH_AUTHOR_LOOKUP_API({searchQuery: 'test', searchKey: 'author'}).apiUrl)
            .reply(200, searchKeyList.author)
            .onGet(repositories.routes.VOCABULARIES_API({id: testId}).apiUrl)
            .reply(200, returnedApiData);

        const route = '/data-collections/add';
        const {container, asFragment, getByText, getByTestId} = renderWithRouter(withRedux()(<AddDataCollection/>), {route});

        const firstRender = asFragment();

        const submitButton = getByTestId('submit-data-collection');
        expect(submitButton).toHaveAttribute('disabled');

        fireEvent.click(getByTestId('deposit-agreement'));
        fireEvent.change(getByTestId('Dataset name'), {target: {value: 'testing'}});
        fireEvent.change(getByTestId('Dataset description'), {target: {value: 'testing'}});
        fireEvent.change(getByTestId('Contact name'), {target: {value: 'testing'}});

        fireEvent.change(getByTestId('downshift-0-input'), {target: {value: 'te'}});
        const contactIdList = await waitForElement(() => getByTestId('downshift-0-menu'), {container});
        fireEvent.select(getByTestId('downshift-0-item-0', contactIdList));

        fireEvent.change(getByTestId('Contact email'), {target: {value: 'testing@test.com'}});
        fireEvent.change(getByTestId('year'), {target: {value: '2018'}});

        fireEvent.change(getByTestId('downshift-1-input'), {target: {value: 'Math'}});
        const forCodesList = await waitForElement(() => getByTestId('downshift-1-menu'), {container});
        fireEvent.click(getByTestId('downshift-1-item-0', forCodesList));

        fireEvent.change(getByTestId('creators-name-as-published-field'), {target: {value: 'test'}});

        fireEvent.focus(getByTestId('downshift-2-input'));
        const creatorRoleList = getByTestId('downshift-2-menu');
        fireEvent.click(getByTestId('downshift-2-item-1', creatorRoleList));
        fireEvent.click(getByText(/add creator/i));

        fireEvent.click(getByTestId('data-collection-access-selector'));
        waitForElement(() => getByTestId('menu-'));
        fireEvent.click(getByText(/mediated access/i));

        fireEvent.click(getByTestId('data-collection-license-selector'));
        waitForElement(() => getByTestId('menu-'));
        fireEvent.click(getByText(/Creative Commons Attribution \(only\) http:\/\/creativecommons.org\/licenses\/by\/3.0\/deed.en_US/i));

        fireEvent.change(getByTestId('Project name'), {target: {value: 'test project'}});
        fireEvent.change(getByTestId('Project description'), {target: {value: 'test description'}});

        expect(submitButton).not.toHaveAttribute('disabled');

        fireEvent.change(getByTestId('Contact email'), {target: {value: 'testing'}});
        expect(container).toHaveTextContent(/email address is not valid/i);
        expect(container).toHaveTextContent(/contact email is required/i);
        expect(submitButton).toHaveAttribute('disabled');

        fireEvent.change(getByTestId('Contact email'), {target: {value: 'testing@test.com'}});
        expect(container).not.toHaveTextContent(/email address is not valid/i);
        expect(container).not.toHaveTextContent(/contact email is required/i);
        expect(submitButton).not.toHaveAttribute('disabled');

        fireEvent.click(getByTestId('deposit-agreement'));
        expect(container).toHaveTextContent(/you are required to accept deposit agreement/i);
        expect(submitButton).toHaveAttribute('disabled');

        fireEvent.click(getByTestId('deposit-agreement'));
        expect(container).not.toHaveTextContent(/you are required to accept deposit agreement/i);
        expect(submitButton).not.toHaveAttribute('disabled');

        expect(firstRender).toMatchDiffSnapshot(asFragment());
    });
});
