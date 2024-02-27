import React from 'react';

import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
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

        /* istanbul ignore else */
        dispatch(
            actions.loadChildVocabList({
                pid: parentId,
                rootId: parentId,
            }),
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const { loadingChildVocab, childData } = useSelector(state => state.get('viewChildVocabReducer'));

    let breadCrumbElements = [];
    if (childData[parentRow.cvo_id]) {
        breadCrumbElements = childData[parentRow.cvo_id].path;
    }

    if ((breadCrumbElements.length > 0 && breadCrumbElements[0].id !== 0) || !breadCrumbElements.length) {
        breadCrumbElements.unshift({ id: 0, title: parentRow.cvo_title });
    }

    const replaceChildVocabTable = parentId => {
        dispatch(
            actions.loadChildVocabList({
                pid: parentId,
                rootId: parentRow.cvo_id,
            }),
        );
    };

    const VocabBreadCrumb = () => {
        // Event handler for button clicks
        const handleButtonClick = (event, id) => {
            replaceChildVocabTable(id);
        };

        const buttons = breadCrumbElements
            .map((em, index) => (
                <Link
                    component="button"
                    underline="hover"
                    data-testid={`nav-${index}`}
                    variant="button"
                    onClick={event => handleButtonClick(event, em.id)}
                >
                    {em.title}
                </Link>
            ))
            .reduce((total, current) => {
                return total ? [total, ' > ', current] : current;
            }, '');

        return <Breadcrumbs>{buttons}</Breadcrumbs>;
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
            <Box sx={{ minHeight: 200, backgroundColor: '#FFF', padding: '10px' }}>
                {loadingChildVocab[parentRow.cvo_id] && (
                    <Grid item md={12}>
                        <InlineLoader loaderId="childControlledVocab-page-loading" message={txt.loading.message} />
                    </Grid>
                )}
                {!!!loadingChildVocab[parentRow.cvo_id] &&
                    childData[parentRow.cvo_id] &&
                    childData[parentRow.cvo_id] &&
                    childData[parentRow.cvo_id].data &&
                    childData[parentRow.cvo_id].data.length >= 0 && (
                        <Grid container spacing={0}>
                            <Grid item md={12}>
                                <VocabBreadCrumb />
                                <Typography
                                    variant="body2"
                                    sx={{ fontWeight: 600, marginBottom: '10px' }}
                                    id={`total-vocab-${parentRow.cvo_id}`}
                                    data-testid={`total-vocab-${parentRow.cvo_id}`}
                                >
                                    {controlledVocabConfig.vocabCountTitle(
                                        childData[parentRow.cvo_id].data.length,
                                        parentRow.cvo_title,
                                    )}{' '}
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
