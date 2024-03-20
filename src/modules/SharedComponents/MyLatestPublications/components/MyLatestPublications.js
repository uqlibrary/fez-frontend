import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { pathConfig } from 'config';
import { locale } from 'locale';

import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import { PublicationsList } from 'modules/SharedComponents/PublicationsList';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { withNavigate } from 'helpers/withNavigate';

export class MyLatestPublications extends PureComponent {
    static propTypes = {
        latestPublicationsList: PropTypes.array,
        totalPublicationsCount: PropTypes.number,
        loadingLatestPublications: PropTypes.bool,
        accountAuthorDetailsLoading: PropTypes.bool,
        actions: PropTypes.object,
        navigate: PropTypes.func.isRequired,
        classes: PropTypes.object,
        isAdmin: PropTypes.bool,
    };

    static defaultProps = {
        latestPublicationsList: [],
        totalPublicationsCount: null,
        loadingLatestPublications: false,
        isAdmin: false,
    };

    componentDidMount() {
        if (!this.props.accountAuthorDetailsLoading) {
            this.props.actions.searchLatestPublications();
        }
    }

    _viewMyResearch = () => {
        this.props.navigate(pathConfig.records.mine);
    };

    render() {
        const txt = locale.components.myLatestPublications;

        if (this.props.loadingLatestPublications) {
            return (
                <div className="isLoading is-centered">
                    <InlineLoader message={txt.loading} />
                </div>
            );
        }

        return (
            <React.Fragment>
                <PublicationsList
                    publicationsList={this.props.latestPublicationsList}
                    showDefaultActions
                    showAdminActions={this.props.isAdmin}
                />
                <Grid container>
                    <Grid item xs />
                    <Grid item xs={12} sm="auto">
                        <Button
                            variant="contained"
                            onClick={this._viewMyResearch}
                            color="secondary"
                            sx={{
                                backgroundColor: 'accent.main',
                                color: 'white.main',
                                '&:hover': {
                                    backgroundColor: 'accent.dark',
                                },
                            }}
                        >
                            {`${txt.viewAllButtonLabel} (${this.props.totalPublicationsCount})`}
                        </Button>
                    </Grid>
                </Grid>
            </React.Fragment>
        );
    }
}

export default withNavigate()(MyLatestPublications);
