import React from 'react';

import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import locale from 'locale/components';
import ChildVocabDataRow from './ChildVocabDataRow';
import { useSelector, useDispatch } from 'react-redux';
import * as actions from 'actions';

const txt = locale.components.controlledVocabulary;
const labels = txt.columns.labels;

export const ChildVocabTable = ({ parentRow }) => {
    const dispatch = useDispatch();
    console.log('useDispatch=', typeof useDispatch, 'actions=', typeof actions);
    // const [sortDirection, setSortDirection] = React.useState('Asc');
    // const [sortBy, setSortBy] = React.useState('title');
    const open = true;
    React.useEffect(() => {
        /* istanbul ignore else */
        if (open) {
            dispatch(
                actions.loadChildVocabList({
                    pid: parentRow.cvo_id,
                }),
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);
    const vocabList = useSelector(state => state.get('viewChildVocabReducer').vocabList);
    const loadingChildVocab = useSelector(state => state.get('viewChildVocabReducer').loadingChildVocab);
    const loadingChildVocabError = useSelector(state => state.get('viewChildVocabReducer').loadingChildVocabError);
    console.log('loadingChildVocab=', loadingChildVocab);
    console.log('loadingChildVocabError=', loadingChildVocabError);

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
                <Grid container spacing={0}>
                    <Grid item md={12}>
                        Title: {parentRow.cvo_title}
                    </Grid>
                    <Grid item md={12}>
                        Key: {parentRow.cvo_id}
                    </Grid>
                    {/* Header Row */}
                    <Grid container spacing={0} sx={{ fontWeight: 400 }} data-testid="vocab-child-header">
                        <Grid item md={1}>
                            {''}
                        </Grid>
                        <Grid item md={8} sm={6} xs={6}>
                            {labels.title}
                        </Grid>
                        <Grid item md={1} xs={2} sm={2}>
                            {labels.license}
                        </Grid>
                        <Grid item md={1} xs={2} sm={2}>
                            {labels.external_id}
                        </Grid>
                        <Grid item md={1}>
                            {labels.actions}
                        </Grid>
                    </Grid>
                    {/* Data Row */}
                    <Grid container sx={{ paddingTop: '10px' }} data-testid="vocab-child-body">
                        {vocabList.map(row => (
                            <ChildVocabDataRow key={row.cvo_id} row={row} />
                        ))}
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};
ChildVocabTable.propTypes = {
    // records: PropTypes.array,
    parentRow: PropTypes.object,
};
export default ChildVocabTable;
