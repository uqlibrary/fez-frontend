import React from 'react';

import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import locale from 'locale/components';
import ChildVocabDataRow from './ChildVocabDataRow';
import { useSelector, useDispatch } from 'react-redux';
import * as actions from 'actions';
import { controlledVocabConfig } from 'config/controlledVocabConfig';
import Typography from '@mui/material/Typography';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';

const txt = locale.components.controlledVocabulary;
const labels = txt.columns.labels;

export const ChildVocabTable = ({ parentRow }) => {
    const dispatch = useDispatch();

    React.useEffect(() => {
        const parentId = parentRow.cvo_id;
        console.log('useEffect id=', parentId);
        /* istanbul ignore else */
        dispatch(
            actions.loadChildVocabList({
                pid: parentId,
                rootId: 0,
            }),
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const { loadingChildVocab, childData } = useSelector(state => state.get('viewChildVocabReducer'));
    console.log('childData=', childData);
    console.log('parentRow.cvo_id=', parentRow.cvo_id);

    let breadCrumbElements = [];
    if (childData[parentRow.cvo_id]) {
        breadCrumbElements = childData[parentRow.cvo_id].path;
    }

    breadCrumbElements.unshift({ id: 0, title: parentRow.cvo_title });

    const replaceChildVocabTable = parentId => {
        dispatch(
            actions.loadChildVocabList({
                pid: parentId,
                rootId: parentRow.cvo_id,
            }),
        );
    };
    // console.log('replaceChildVocabTable=', replaceChildVocabTable);

    // vocabChildCountTitle = (total, parentTitle, extraPath = []) => {
    //     let ret = `Displaying ${total} controlled vocabularies`;
    //     const changeToLink = (id, title) => {
    //         return <span onClick={replaceChildVocabTable(id, title)} />;
    //     };
    //     let breadCrumb = changeToLink(0, parentTitle);
    //     for (let i = 0; i < extraPath.length; i++) {
    //         const link = changeToLink(extraPath[i].id, extraPath[i].title);
    //         breadCrumb += ` > ${link}`;
    //     }

    //     ret += breadCrumb ? ' of: ' + breadCrumb : '';
    //     return ret;
    // };

    // A functional component that renders a list of buttons
    const BreadCrumb = () => {
        // Event handler for button clicks
        const handleButtonClick = (event, id) => {
            console.log(event.target);
            replaceChildVocabTable(id);
        };

        const buttons = breadCrumbElements
            .map((em, index) => (
                <button key={index} onClick={event => handleButtonClick(event, em.id)}>
                    {em.title}
                </button>
            ))
            .reduce((total, current) => {
                return [total, ' > ', current];
            });

        // // Create an array of button elements dynamically
        // const buttons = ['Thing 1', 'Thing 2', 'Thing 3'].map((label, index) => (
        //     <button key={index} onClick={event => handleButtonClick(event, index)}>
        //         {label}
        //     </button>
        // ));

        return <div className="button-list">{buttons}</div>;
    };

    // const totalRecords = childData.length;
    // const findItem = existingList.find(em => em.data && em.data[0].cvr_parent_cvo_id === parentRow.cvo_id);
    // let vocabList = [];
    // let totalRecords = 0;
    // if (findItem) {
    //     vocabList = findItem.data;
    //     totalRecords = findItem.total;
    // }

    return (
        <Box
            sx={{
                backgroundColor: '#eee',
                padding: '20px',
                boxShadow: 'inset 0px 2px 4px 0px rgba(0,0,0,0.2)',
            }}
            data-testid={`vocab-table-${parentRow.cvo_id}`}
            id={`vocab-table-${parentRow.cvo_id}`}
        >
            <Box sx={{ minHeight: 200, backgroundColor: '#FFF', padding: '10px' }}>
                {loadingChildVocab && (
                    <Grid item md={12}>
                        <InlineLoader loaderId="childControlledVocab-page-loading" message={txt.loading.message} />
                    </Grid>
                )}
                {!!!loadingChildVocab &&
                    childData[parentRow.cvo_id] &&
                    childData[parentRow.cvo_id] &&
                    childData[parentRow.cvo_id].data &&
                    childData[parentRow.cvo_id].data.length >= 0 && (
                        <Grid container spacing={0}>
                            <Grid item md={12}>
                                <Typography
                                    variant="body2"
                                    sx={{ fontWeight: 600, marginBottom: '10px' }}
                                    id={`total-vocab-${parentRow.cvo_id}`}
                                    data-testid={`total-vocab-${parentRow.cvo_id}`}
                                >
                                    {controlledVocabConfig.vocabCountTitle(
                                        childData[parentRow.cvo_id].data.length,
                                        parentRow.cvo_title,
                                    )}
                                    <BreadCrumb />
                                </Typography>
                            </Grid>
                            {/* Header Row */}
                            <Grid container spacing={0} sx={{ fontWeight: 400 }} data-testid="vocab-child-header">
                                <Grid item md={1}>
                                    {labels.id}
                                </Grid>
                                <Grid item md={3}>
                                    {labels.title}
                                </Grid>
                                <Grid item md={3}>
                                    <Box>{labels.desc}</Box>
                                </Grid>
                                <Grid item md={1}>
                                    <Box>{labels.order}</Box>
                                </Grid>
                                <Grid item md={2}>
                                    {labels.license}
                                </Grid>
                                <Grid item md={1}>
                                    {labels.external_id}
                                </Grid>
                                <Grid item md={1}>
                                    {labels.actions}
                                </Grid>
                            </Grid>
                            {/* Data Row */}
                            <Grid container sx={{ paddingTop: '10px' }} data-testid="vocab-child-body">
                                {childData[parentRow.cvo_id].data.map(row => (
                                    <ChildVocabDataRow
                                        key={row.controlled_vocab.cvo_id}
                                        row={row.controlled_vocab}
                                        rootId={parentRow.cvo_id}
                                    />
                                ))}
                            </Grid>
                        </Grid>
                    )}
            </Box>
        </Box>
    );
};
ChildVocabTable.propTypes = {
    parentRow: PropTypes.object,
};
export default ChildVocabTable;
