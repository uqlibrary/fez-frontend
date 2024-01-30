/* eslint-disable no-unused-vars */
import React, { useContext } from 'react';
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
} from './ControlledVocabularyContext';

const StyledAddButtonWrapper = styled('div')(({ theme }) => ({
    float: 'left',
    [theme.breakpoints.down('sm')]: {
        float: 'none',
    },
}));

export const ControlledVocabularies = () => {
    const dispatch = useDispatch();
    const sortedList = useSelector(state => state.get('viewVocabReducer').vocabList);
    const loadingVocab = useSelector(state => state.get('viewVocabReducer').loadingVocab);
    const totalRecords = useSelector(state => state.get('viewVocabReducer').totalRecords);
    const loadingVocabError = useSelector(state => state.get('viewVocabReducer').loadingVocabError);
    const actions = useContext(ControlledVocabulariesActionContext);
    const adminDialogState = useContext(ControlledVocabulariesStateContext);

    React.useEffect(() => {
        dispatch(actions.loadControlledVocabList());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const txt = locale.components.controlledVocabulary;

    const labels = txt.columns.labels;
    return (
        <ControlledVocabulariesProvider>
            {console.log(actions)}
            <StandardPage title={txt.title.controlledVocabulary}>
                <UpdateDialog
                    {...adminDialogState}
                    locale={{ confirmButtonLabel: 'Save', cancelButtonLabel: 'cancel' }}
                    columns={txt.form.columns}
                    fields={fieldConfig.fields}
                    row={{}}
                    onCancelAction={actions.onHandleDialogClickClose}
                    onAction={actions.onHandleDialogClickSave}
                />
                {!!!loadingVocabError && (
                    <React.Fragment>
                        <Box sx={{ overflow: 'auto', marginBottom: '10px' }}>
                            <StyledAddButtonWrapper data-testid="admin-add-community">
                                <Button
                                    data-testid="admin-add-vocabulary-button"
                                    startIcon={<Add />}
                                    variant={'contained'}
                                    color={'primary'}
                                    onClick={actions.onAdminAddActionClick}
                                >
                                    Add Vocabulary
                                </Button>
                            </StyledAddButtonWrapper>
                        </Box>
                        <StandardCard noHeader style={{ marginTop: 10 }}>
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
                    </React.Fragment>
                )}
                {!!loadingVocabError && (
                    <Grid item xs={12} style={{ marginTop: 10 }}>
                        <Alert title="An error has occurred" message={loadingVocabError.message} type="info_outline" />
                    </Grid>
                )}
            </StandardPage>
        </ControlledVocabulariesProvider>
    );
};

export default React.memo(ControlledVocabularies);
