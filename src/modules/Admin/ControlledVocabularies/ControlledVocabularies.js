import React from 'react';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import Grid from '@mui/material/Grid';
import { Alert } from 'modules/SharedComponents/Toolbox/Alert';

import { userIsAdmin } from 'hooks';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import Typography from '@mui/material/Typography';
import { controlledVocabConfig } from 'config';

// import * as actions from 'actions';
import * as actions from 'actions/viewControlledVocab';
import locale from 'locale/components';
import { useDispatch, useSelector } from 'react-redux';

import queryString from 'query-string';
import { useHistory } from 'react-router-dom';

import { pushHistory } from './components/functions.js';
import { VocabTable } from './components/VocabTable.js';

// import { styled } from '@mui/material/styles';
// import Button from '@mui/material/Button';
// import Box from '@mui/material/Box';
// import Switch from '@mui/material/Switch';
// import FormControlLabel from '@mui/material/FormControlLabel';
// import { Link } from 'react-router-dom';
// import { pathConfig } from 'config';
// import Add from '@mui/icons-material/Add';

// const StyledAddButtonWrapper = styled('div')(({ theme }) => ({
//     float: 'left',
//     [theme.breakpoints.down('sm')]: {
//         float: 'none',
//     },
// }));
// const StyledAutoCloseWrapper = styled('div')(({ theme }) => ({
//     float: 'right',
//     [theme.breakpoints.down('sm')]: {
//         float: 'none',
//     },
// }));

export const ControlledVocabularies = () => {
    // const [autoCollapse, setAutoCollapse] = React.useState(false);
    // const handleSwitchChange = event => {
    //     setAutoCollapse(event.target.checked);
    // };

    const history = useHistory();
    let sortDirection = 'Asc';
    let sortBy = 'title';

    const adminUser = userIsAdmin();

    const dispatch = useDispatch();

    const queryStringObject = queryString.parse(
        location && ((location.hash && location.hash.replace('?', '&').replace('#', '?')) || location.search),
        { ignoreQueryPrefix: true },
    );

    sortDirection = queryStringObject.sortDirection ? queryStringObject.sortDirection : sortDirection;
    sortDirection = sortDirection.charAt(0).toUpperCase() + sortDirection.slice(1);
    sortBy = queryStringObject.sortBy ? queryStringObject.sortBy : sortBy;

    const vocabList = useSelector(state => state.get('viewVocabReducer').vocabList);
    console.log('vocabList=', vocabList);
    const loadingVocab = useSelector(state => state.get('viewVocabReducer').loadingVocab);
    const totalRecords = useSelector(state => state.get('viewVocabReducer').totalRecords);
    const startRecord = useSelector(state => state.get('viewVocabReducer').startRecord);
    const endRecord = useSelector(state => state.get('viewVocabReducer').endRecord);
    const loadingVocabError = useSelector(state => state.get('viewVocabReducer').loadingVocabError);

    const currentPage = queryStringObject.page ? parseInt(queryStringObject.page, 10) : 1;
    const perPage = queryStringObject.pageSize ? parseInt(queryStringObject.pageSize, 10) : 10;

    React.useEffect(() => {
        // if (confirm('see new UI?')) return;
        dispatch(
            actions.loadControlledVocabList({
                pageSize: perPage,
                page: currentPage,
                direction: sortDirection,
                sortBy: sortBy,
            }),
        );
        pushHistory(history, perPage, currentPage, sortBy, sortDirection);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const txt = locale.components.controlledVocabularyCollections;

    const labels = txt.columns.labels;

    const sortedList = [...vocabList];
    return (
        <StandardPage title={txt.title.controlledVocabulary}>
            {!!!loadingVocabError && (
                <React.Fragment>
                    <StandardCard noHeader style={{ marginTop: 10 }}>
                        {!!!loadingVocab && (
                            <Typography
                                variant="body2"
                                sx={{ fontWeight: 600, marginBottom: '10px' }}
                                id="total-vocab"
                                data-testid="total-vocab"
                            >
                                {controlledVocabConfig.vocabCountTitle(startRecord, endRecord, totalRecords)}
                            </Typography>
                        )}

                        {sortedList.length > 0 ? (
                            <VocabTable records={sortedList} labels={labels} conf={txt} adminUser={adminUser} />
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
    );
};

export default React.memo(ControlledVocabularies);
