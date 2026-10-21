// Minimal Field-of-Research (FoR) vocabulary fixture.
// This was a ~4.3MB / 72,820-line dump of the full FoR tree, but it is imported by only two tests
// (it is NOT part of the mock barrel or the mock server), and both only exercise a single branch:
//   - reducers/viewChildVocabReducer.test.js  navigates 451780 -> 451799 -> 451800 -> 451801
//   - AddDataCollection/AddDataCollection2.test.js  searches the FoR field for "010101"
// So we keep just the 01 -> 0101 -> 010101 subtree those tests use. Node shape matches the real API
// (findCurrentChild relies on cvr_parent_cvo_id / cvr_child_cvo_id / controlled_vocab.controlled_vocab_children).
export const vocabsFieldResearch = {
    total: 1,
    data: [
        {
            cvr_id: 2931,
            cvr_parent_cvo_id: 451780,
            cvr_child_cvo_id: 451799,
            controlled_vocab: {
                cvo_id: 451799,
                cvo_title: '01 Mathematical Sciences',
                cvo_desc: 'FOR2008',
                cvo_image_filename: null,
                cvo_external_id: '01',
                cvo_hide: 0,
                cvo_order: null,
                cvo_lat: null,
                cvo_long: null,
                cvo_policy: null,
                cvo_created_at: '2022-01-19 09:09:05',
                cvo_updated_at: '2023-06-26 21:30:00',
                controlled_vocab_children: [
                    {
                        cvr_id: 2932,
                        cvr_parent_cvo_id: 451799,
                        cvr_child_cvo_id: 451800,
                        controlled_vocab: {
                            cvo_id: 451800,
                            cvo_title: '0101 Pure Mathematics',
                            cvo_desc: 'FOR2008',
                            cvo_image_filename: null,
                            cvo_external_id: '0101',
                            cvo_hide: 0,
                            cvo_order: null,
                            cvo_lat: null,
                            cvo_long: null,
                            cvo_policy: null,
                            cvo_created_at: '2022-01-19 09:09:05',
                            cvo_updated_at: '2023-06-26 21:30:00',
                            controlled_vocab_children: [
                                {
                                    cvr_id: 2933,
                                    cvr_parent_cvo_id: 451800,
                                    cvr_child_cvo_id: 451801,
                                    controlled_vocab: {
                                        cvo_id: 451801,
                                        cvo_title: '010101 Algebra and Number Theory',
                                        cvo_desc: 'FOR2008',
                                        cvo_image_filename: null,
                                        cvo_external_id: '010101',
                                        cvo_hide: 0,
                                        cvo_order: null,
                                        cvo_lat: null,
                                        cvo_long: null,
                                        cvo_policy: null,
                                        cvo_created_at: '2022-01-19 09:09:05',
                                        cvo_updated_at: '2023-06-26 21:30:00',
                                        controlled_vocab_children: [],
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
};
