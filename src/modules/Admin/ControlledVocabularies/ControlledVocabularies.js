import React, { useContext } from 'react';
import { createPortal } from 'react-dom';
import { styled } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { SubmissionError } from 'redux-form/immutable';

import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Add from '@mui/icons-material/Add';

import { controlledVocabConfig } from 'config/controlledVocabConfig';
import * as actions from 'actions/viewControlledVocab';
import locale from 'locale/components';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { Alert } from 'modules/SharedComponents/Toolbox/Alert';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import { VocabTable } from './components/VocabTable';
import AdminPanel from './components/AdminPanelContainer';
import {
    ControlledVocabulariesProvider,
    ControlledVocabulariesStateContext,
    ControlledVocabulariesActionContext,
} from './ControlledVocabularyContext';
import { transformAdminRequest } from './components/utils';

import { isReadonlyVocab } from 'config/general';

const StyledAddButtonWrapper = styled('div')(({ theme }) => ({
    float: 'left',
    [theme.breakpoints.down('sm')]: {
        float: 'none',
    },
}));

const ControlledVocabularies = () => {
    const dispatch = useDispatch();
    const { vocabList, loadingVocab, totalRecords, loadingVocabError } = useSelector(state =>
        state.get('viewVocabReducer'),
    );

    const sortedList = React.useMemo(() => {
        // sort top level vocab list to show editable rows first
        const tmpArr = vocabList.map(vocab => ({ ...vocab, locked: isReadonlyVocab(vocab.cvo_id) }));
        return tmpArr.sort((a, b) => a.locked - b.locked);
    }, [vocabList]);

    const { onAdminAddActionClick, onHandleDialogClickClose } = useContext(ControlledVocabulariesActionContext);
    const state = useContext(ControlledVocabulariesStateContext);

    React.useEffect(() => {
        dispatch(actions.loadControlledVocabList());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const txt = locale.components.controlledVocabulary;

    const handleDialogClickClose = () => {
        onHandleDialogClickClose();
        dispatch(actions.clearAdminControlledVocabulary());
    };

    const handleDialogClickSave = (parentId, rootVocabId) => values => {
        const data = { ...values.toJS() };
        const wrappedRequest = transformAdminRequest({
            request: data,
            parentId,
            action: state.action,
        });

        return dispatch(actions.adminControlledVocabulary(wrappedRequest, state.action))
            .then(() => {
                handleDialogClickClose();
                const adminFunction = rootVocabId ? actions.loadChildVocabList : actions.loadControlledVocabList;
                dispatch(
                    adminFunction({
                        pid: parentId,
                        rootId: rootVocabId,
                    }),
                );
            })
            .catch(error => {
                console.error(error);
                throw new SubmissionError({ _error: error });
            });
    };

    return (
        <StandardPage title={txt.title.controlledVocabulary}>
            <>
                {createPortal(
                    <AdminPanel
                        {...state}
                        locale={txt.admin}
                        onCancelAction={handleDialogClickClose}
                        onAction={handleDialogClickSave}
                    />,
                    state.portalId ? document.getElementById(state.portalId) : document.body,
                    state.portalId ?? 'portal-root',
                )}
                {!!!loadingVocabError && (
                    <Box marginBlockStart={2}>
                        <Box sx={{ overflow: 'auto', marginBottom: '10px' }}>
                            <StyledAddButtonWrapper data-testid="admin-add-community">
                                <Button
                                    data-testid="admin-add-vocabulary-button"
                                    startIcon={<Add />}
                                    variant={'contained'}
                                    color={'primary'}
                                    onClick={() => onAdminAddActionClick()}
                                    disabled={state.isOpen}
                                >
                                    {txt.admin.addButtonLabel}
                                </Button>
                            </StyledAddButtonWrapper>
                        </Box>
                        <Box id={'portal-root'} data-testid={'portal-root'} />
                        <StandardCard noHeader>
                            {!!!loadingVocab && (
                                <Typography
                                    variant="body2"
                                    sx={{ fontWeight: 600, marginBottom: '10px' }}
                                    id="total-vocab"
                                    data-testid="total-vocab"
                                >
                                    {controlledVocabConfig.vocabCountTitle(totalRecords)}
                                </Typography>
                            )}

                            {sortedList.length > 0 ? (
                                <VocabTable records={sortedList} labels={txt.columns.labels} />
                            ) : (
                                <InlineLoader loaderId={'vocab-page-loading'} message={txt.loading.message} />
                            )}
                        </StandardCard>
                    </Box>
                )}
                {!!loadingVocabError && (
                    <Grid item xs={12}>
                        <Alert
                            alertId="alert_controlled_vocabularies"
                            title={txt.error.title}
                            message={loadingVocabError.message}
                            type="info_outline"
                        />
                    </Grid>
                )}
            </>
        </StandardPage>
    );
};

export const ControlledVocabulariesWrapper = () => {
    return (
        <ControlledVocabulariesProvider>
            <ControlledVocabularies />
        </ControlledVocabulariesProvider>
    );
};

export default React.memo(ControlledVocabulariesWrapper);
