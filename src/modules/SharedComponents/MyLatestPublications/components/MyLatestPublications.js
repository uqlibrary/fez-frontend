import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { pathConfig } from 'config';
import { locale } from 'locale';

import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import { PublicationsList } from 'modules/SharedComponents/PublicationsList';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import withStyles from '@mui/styles/withStyles';

export const styles = theme => ({
    blueButton: {
        backgroundColor: theme.palette.accent.main,
        color: theme.palette.white.main,
        '&:hover': {
            backgroundColor: theme.palette.accent.dark,
        },
    },
});

export class MyLatestPublications extends PureComponent {
    static propTypes = {
        latestPublicationsList: PropTypes.array,
        totalPublicationsCount: PropTypes.number,
        loadingLatestPublications: PropTypes.bool,
        accountAuthorDetailsLoading: PropTypes.bool,
        actions: PropTypes.object,
        history: PropTypes.object.isRequired,
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
        this.props.history.push(pathConfig.records.mine);
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
                            className={this.props.classes.blueButton}
                        >
                            {`${txt.viewAllButtonLabel} (${this.props.totalPublicationsCount})`}
                        </Button>
                    </Grid>
                </Grid>
            </React.Fragment>
        );
    }
}

export default withStyles(styles)(MyLatestPublications);
