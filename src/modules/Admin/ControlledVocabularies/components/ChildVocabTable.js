/* eslint-disable no-unused-vars */
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';

import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Add from '@mui/icons-material/Add';

import locale from 'locale/components';
import * as actions from 'actions';

import ChildVocabDataRow from './ChildVocabDataRow';
import { controlledVocabConfig } from 'config/controlledVocabConfig';
import { ControlledVocabulariesActionContext } from '../ControlledVocabularyContext';
import { ControlledVocabulariesStateContext } from '../ControlledVocabularyContext';

const txt = locale.components.controlledVocabulary;
const labels = txt.columns.labels;

export const ChildVocabTable = ({ parentRow }) => {
    const dispatch = useDispatch();
    const { onAdminAddActionClick } = useContext(ControlledVocabulariesActionContext);
    const state = useContext(ControlledVocabulariesStateContext);

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
    const totalRecords = useSelector(state => state.get('viewChildVocabReducer').totalRecords);

    const handleAddActionClick = () => {
        console.log('handleAddActionClick', parentRow.cvo_id);
        onAdminAddActionClick(parentRow.cvo_id);
    };
    const onAdminEditActionClick = vocab => {
        console.log('onAdminEditActionClick', vocab);
    };

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
            <Button
                id={`admin-add-community-button-${parentRow.cvo_id}`}
                data-testid={`admin-add-community-button-${parentRow.cvo_id}`}
                startIcon={<Add />}
                variant={'contained'}
                color={'primary'}
                sx={{ marginBottom: '10px' }}
                onClick={handleAddActionClick}
                disabled={state.isOpen}
            >
                Add Child Vocabulary
            </Button>

            <Box id={`portal-add-${parentRow.cvo_id}`} />
            <Box sx={{ minHeight: 200, backgroundColor: '#FFF', padding: '10px' }}>
                <Grid container spacing={0}>
                    <Grid item md={12}>
                        <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, marginBottom: '10px' }}
                            id={`total-vocab-${parentRow.cvo_id}`}
                            data-testid={`total-vocab-${parentRow.cvo_id}`}
                        >
                            {controlledVocabConfig.vocabCountTitle(totalRecords, parentRow.cvo_title)}
                        </Typography>
                    </Grid>
                    {/* Header Row */}
                    <Grid container spacing={0} sx={{ fontWeight: 400 }} data-testid="vocab-child-header">
                        <Grid item md={8}>
                            {labels.title}
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
                        {vocabList.map(row => (
                            <ChildVocabDataRow
                                key={row.controlled_vocab.cvo_id}
                                row={row.controlled_vocab}
                                onAdminEditActionClick={onAdminEditActionClick}
                            />
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
