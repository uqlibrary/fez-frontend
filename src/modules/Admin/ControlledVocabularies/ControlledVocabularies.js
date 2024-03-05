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

const StyledAddButtonWrapper = styled('div')(({ theme }) => ({
    float: 'left',
    [theme.breakpoints.down('sm')]: {
        float: 'none',
    },
}));

const ControlledVocabularies = () => {
    const dispatch = useDispatch();
    const { vocabList: sortedList, loadingVocab, totalRecords, loadingVocabError } = useSelector(state =>
        state.get('viewVocabReducer'),
    );

    // const [adminDialogueBusy, setAdminDialogueBusy] = React.useState(false);

    const { onAdminAddActionClick, onHandleDialogClickClose } = useContext(ControlledVocabulariesActionContext);
    const adminDialogState = useContext(ControlledVocabulariesStateContext);

    React.useEffect(() => {
        dispatch(actions.loadControlledVocabList());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const txt = locale.components.controlledVocabulary;

    const labels = txt.columns.labels;

    const handleDialogClickClose = () => {
        onHandleDialogClickClose();
        dispatch(actions.clearAdminControlledVocabulary());
    };

    const handleDialogClickSave = (parentId, rootVocabId) => values => {
        const data = { ...values.toJS() };
        const wrappedRequest = transformAdminRequest({
            request: data,
            parentId,
            rootVocabId,
            action: adminDialogState.action,
        });

        console.log('parentId=', parentId, 'rootVocabId=', rootVocabId);
        console.log('data=', data);
        return dispatch(actions.adminControlledVocabulary(wrappedRequest, adminDialogState.action))
            .then(() => {
                handleDialogClickClose();
                const adminFunction =
                    rootVocabId && +parentId !== +rootVocabId
                        ? actions.loadChildVocabList
                        : actions.loadControlledVocabList;
                console.log('adminFunction=', adminFunction);
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
                        {...adminDialogState}
                        locale={txt.admin}
                        onCancelAction={handleDialogClickClose}
                        onAction={handleDialogClickSave}
                    />,
                    adminDialogState.portalId ? document.getElementById(adminDialogState.portalId) : document.body,
                    adminDialogState.portalId ?? 'portal-root',
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
                                    disabled={adminDialogState.isOpen}
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
                                <VocabTable records={sortedList} labels={labels} />
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
