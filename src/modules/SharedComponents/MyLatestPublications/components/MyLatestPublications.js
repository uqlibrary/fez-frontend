import React from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';

import { pathConfig } from 'config';
import { locale } from 'locale';
import * as actions from 'actions';

import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import { PublicationsList } from 'modules/SharedComponents/PublicationsList';
import Grid from '@mui/material/GridLegacy';
import Button from '@mui/material/Button';

export const openAccessibleProps = navigate => {
    const txt = locale.components.myLatestPublications;

    const _actions = [
        {
            label: txt.openAccessible.openAccess,
            handleAction: record => {
                navigate(pathConfig.records.openAccessComplianceFix(record.rek_pid));
            },
            primary: true,
        },
        {
            label: txt.openAccessible.correction,
            handleAction: record => {
                navigate(pathConfig.records.fix(record.rek_pid));
            },
            primary: false,
        },
    ];

    return {
        forceUseCustomActions: record => record.potentiallyOpenAccessible?.(),
        customActions: _actions,
    };
};

export const MyLatestPublications = ({ isAdmin = false }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { latestPublicationsList, loadingLatestPublications, totalPublicationsCount } = useSelector(state =>
        state.get('myLatestPublicationsReducer'),
    );

    const { author } = useSelector(state => state.get('accountReducer')) || /* istanbul ignore next */ false;

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
            <PublicationsList
                publicationsList={latestPublicationsList}
                showDefaultActions
                showAdminActions={isAdmin}
                {...openAccessibleProps(navigate)}
            />
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

export default React.memo(MyLatestPublications);
