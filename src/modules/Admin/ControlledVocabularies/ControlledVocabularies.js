/* eslint-disable no-unused-vars */
import React, { useContext } from 'react';
import { createPortal } from 'react-dom';
import { styled } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';

import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Add from '@mui/icons-material/Add';

import { controlledVocabConfig } from 'config/controlledVocabConfig';
import * as actions from 'actions/viewControlledVocab';
import locale from 'locale/components';
import fieldConfig from './components/fieldConfig';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { Alert } from 'modules/SharedComponents/Toolbox/Alert';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import { VocabTable } from './components/VocabTable';
import UpdateDialog from './components/UpdateDialog';
import {
    ControlledVocabulariesProvider,
    ControlledVocabulariesStateContext,
    ControlledVocabulariesActionContext,
    ACTION,
} from './ControlledVocabularyContext';
import { transformAddRequest } from './components/utils';

const StyledAddButtonWrapper = styled('div')(({ theme }) => ({
    float: 'left',
    [theme.breakpoints.down('sm')]: {
        float: 'none',
    },
}));

const ControlledVocabularies = () => {
    const dispatch = useDispatch();
    const sortedList = useSelector(state => state.get('viewVocabReducer').vocabList);
    const loadingVocab = useSelector(state => state.get('viewVocabReducer').loadingVocab);
    const totalRecords = useSelector(state => state.get('viewVocabReducer').totalRecords);
    const loadingVocabError = useSelector(state => state.get('viewVocabReducer').loadingVocabError);
    const [adminDialogueBusy, setAdminDialogueBusy] = React.useState(false);

    const { onAdminAddActionClick, onHandleDialogClickClose } = useContext(ControlledVocabulariesActionContext);
    const adminDialogState = useContext(ControlledVocabulariesStateContext);

    React.useEffect(() => {
        dispatch(actions.loadControlledVocabList());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const txt = locale.components.controlledVocabulary;

    const labels = txt.columns.labels;

    const onHandleDialogClickSave = data => {
        console.log(data);
        const request = structuredClone(data);
        const wrappedRequest = transformAddRequest({ request });

        setAdminDialogueBusy(true);

        if (adminDialogState.action === ACTION.ADD) {
            dispatch(actions.addControlledVocabulary(wrappedRequest))
                .then(() => {
                    const adminFunction = data.hasOwnProperty('cvr_parent_cvo_id')
                        ? actions.loadChildVocabList
                        : actions.loadControlledVocabList;
                    dispatch(
                        adminFunction({
                            pid: data.cvr_parent_cvo_id,
                        }),
                    ).then(() => {
                        setAdminDialogueBusy(false);
                        onHandleDialogClickClose();
                    });
                })
                .catch(error => {
                    console.error(error);
                })
                .finally(() => {
                    setAdminDialogueBusy(false);
                });
        }
    };

    return (
        <StandardPage title={txt.title.controlledVocabulary}>
            {createPortal(
                <UpdateDialog
                    {...adminDialogState}
                    locale={{ confirmButtonLabel: 'Save', cancelButtonLabel: 'cancel' }}
                    columns={txt.form.columns}
                    fields={fieldConfig.fields}
                    onCancelAction={onHandleDialogClickClose}
                    onAction={onHandleDialogClickSave}
                    isBusy={adminDialogueBusy}
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
                                Add Vocabulary
                            </Button>
                        </StyledAddButtonWrapper>
                    </Box>
                    <Box id={'portal-root'} />
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
                    <Alert title="An error has occurred" message={loadingVocabError.message} type="info_outline" />
                </Grid>
            )}
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
