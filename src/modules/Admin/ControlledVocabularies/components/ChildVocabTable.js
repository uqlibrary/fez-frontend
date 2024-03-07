/* eslint-disable no-unused-vars */
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';

import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Add from '@mui/icons-material/Add';

import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';

import locale from 'locale/components';
import * as actions from 'actions';

import ChildVocabDataRow from './ChildVocabDataRow';
import { controlledVocabConfig } from 'config/controlledVocabConfig';
import { ControlledVocabulariesActionContext } from '../ControlledVocabularyContext';
import { ControlledVocabulariesStateContext } from '../ControlledVocabularyContext';

import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';

const txt = locale.components.controlledVocabulary;
const labels = txt.columns.labels;

export const ChildVocabTable = ({ parentRow, locked }) => {
    const dispatch = useDispatch();
    const { onAdminAddActionClick } = useContext(ControlledVocabulariesActionContext);
    const state = useContext(ControlledVocabulariesStateContext);

    React.useEffect(() => {
        const parentId = parentRow.cvo_id;

        dispatch(
            actions.loadChildVocabList({
                pid: parentId,
                rootId: parentId,
            }),
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleAddActionClick = () => {
        const navs = document.querySelectorAll(`#vocabNav-${parentRow.cvo_id} [id^=nav]`);
        const parentId = +navs[navs.length - 1].id.replace('nav-', '');
        onAdminAddActionClick(parentId, parentRow.cvo_id);
    };

    const { loadingChildVocab, childData } = useSelector(state => state.get('viewChildVocabReducer'));

    let breadCrumbElements = [];
    if (childData[parentRow.cvo_id]) {
        breadCrumbElements = childData[parentRow.cvo_id].path;
    }

    if (!breadCrumbElements.find(em => em.id === parentRow.cvo_id)) {
        breadCrumbElements.unshift({ id: parentRow.cvo_id, title: parentRow.cvo_title });
    }

    const replaceChildVocabTable = parentId => {
        dispatch(
            actions.loadChildVocabList({
                pid: parentId,
                rootId: parentRow.cvo_id,
            }),
        );
    };

    const VocabBreadCrumb = ({ id }) => {
        // Event handler for button clicks
        const handleButtonClick = (event, id) => {
            replaceChildVocabTable(id);
        };

        const buttons = breadCrumbElements
            .map(em => (
                <Link
                    key={`nav-${em.id}`}
                    component="button"
                    underline="always"
                    id={`nav-${em.id}`}
                    data-testid={`nav-${em.id}`}
                    variant="button"
                    onClick={event => handleButtonClick(event, em.id)}
                >
                    {em.title}
                </Link>
            ))
            .reduce((total, current) => {
                return total ? [total, ' > ', current] : current;
            }, '');

        return (
            <Breadcrumbs aria-label="breadcrumb" separator="›" id={id}>
                {buttons}
            </Breadcrumbs>
        );
    };
    VocabBreadCrumb.propTypes = {
        id: PropTypes.string,
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
            {!locked && (
                <Button
                    id={`admin-add-vocabulary-button-${parentRow.cvo_id}`}
                    data-testid={`admin-add-vocabulary-button-${parentRow.cvo_id}`}
                    startIcon={<Add />}
                    variant={'contained'}
                    color={'primary'}
                    sx={{ marginBottom: '10px' }}
                    onClick={handleAddActionClick}
                    disabled={state.isOpen}
                >
                    {txt.admin.addChildButtonLabel}
                </Button>
            )}

            <Box
                id={`portal-add-${parentRow.cvo_id}`}
                data-testid={`portal-add-${parentRow.cvo_id}`}
                sx={{ width: '100%' }}
            />
            <Box sx={{ minHeight: 200, backgroundColor: '#FFF', padding: '10px' }}>
                {loadingChildVocab[parentRow.cvo_id] && (
                    <Grid item md={12}>
                        <InlineLoader loaderId="childControlledVocab-page-loading" message={txt.loading.message} />
                    </Grid>
                )}
                {!!!loadingChildVocab[parentRow.cvo_id] && (childData[parentRow.cvo_id]?.data?.length ?? -1) >= 0 && (
                    <Grid container spacing={0}>
                        <Grid item md={12}>
                            <VocabBreadCrumb id={`vocabNav-${parentRow.cvo_id}`} />
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
                            <Grid item xs={12} sm={1}>
                                {labels.id}
                            </Grid>
                            <Grid item xs={12} sm={locked ? 5 : 4}>
                                {labels.title}
                            </Grid>
                            <Grid item xs={12} sm={5}>
                                {labels.desc}
                            </Grid>
                            <Grid item xs={12} sm={1}>
                                {labels.external_id}
                            </Grid>
                            {!locked && (
                                <Grid item xs={12} sm={1}>
                                    {labels.actions}
                                </Grid>
                            )}
                        </Grid>
                        {/* Data Row */}
                        <Grid container sx={{ paddingTop: '10px' }} data-testid="vocab-child-body">
                            {childData[parentRow.cvo_id].data.map(row => (
                                <ChildVocabDataRow
                                    key={row.controlled_vocab.cvo_id}
                                    row={row.controlled_vocab}
                                    parentId={row.cvr_parent_cvo_id}
                                    rootId={parentRow.cvo_id}
                                    locked={locked}
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
    locked: PropTypes.bool,
};
export default ChildVocabTable;
