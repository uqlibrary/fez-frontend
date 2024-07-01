import React from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { pathConfig } from 'config';
import { locale } from 'locale';
import * as actions from 'actions';

import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import { PublicationsList } from 'modules/SharedComponents/PublicationsList';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';

export const MyLatestPublications = ({ isAdmin }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { latestPublicationsList, loadingLatestPublications, totalPublicationsCount } = useSelector(state =>
        state.get('myLatestPublicationsReducer'),
    );

    const { author } = useSelector(state => state.get('accountReducer')) || false;

    React.useEffect(() => {
        if (!!author) {
            dispatch(actions.searchLatestPublications());
        }
    }, [author, dispatch]);

    const _viewMyResearch = () => {
        navigate(pathConfig.records.mine);
    };

    const txt = locale.components.myLatestPublications;

    if (loadingLatestPublications) {
        return (
            <div className="isLoading is-centered">
                <InlineLoader message={txt.loading} />
            </div>
        );
    }

    return (
        <React.Fragment>
            <PublicationsList publicationsList={latestPublicationsList} showDefaultActions showAdminActions={isAdmin} />
            <Grid container>
                <Grid item xs />
                <Grid item xs={12} sm="auto">
                    <Button
                        variant="contained"
                        onClick={_viewMyResearch}
                        color="secondary"
                        sx={{
                            backgroundColor: 'accent.main',
                            color: 'white.main',
                            '&:hover': {
                                backgroundColor: 'accent.dark',
                            },
                        }}
                    >
                        {`${txt.viewAllButtonLabel} (${totalPublicationsCount})`}
                    </Button>
                </Grid>
            </Grid>
        </React.Fragment>
    );
};

MyLatestPublications.propTypes = {
    isAdmin: PropTypes.bool,
};

MyLatestPublications.defaultProps = {
    isAdmin: false,
};

export default React.memo(MyLatestPublications);
