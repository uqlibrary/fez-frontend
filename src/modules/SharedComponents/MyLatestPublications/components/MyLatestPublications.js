import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

import {routes} from 'config';
import {locale} from 'locale';

import {InlineLoader} from 'modules/SharedComponents/Toolbox/Loaders';
import {PublicationsList} from 'modules/SharedComponents/PublicationsList';
import {Button, withStyles} from '@material-ui/core';

const styles = (theme) => ({
    blueButton: {
        backgroundColor: theme.palette.accent.main,
        color: theme.palette.white.main,
        '&:hover': {
            backgroundColor: theme.palette.accent.dark,
        },
        float: 'right'
    }
});

export class MyLatestPublications extends PureComponent {
    static propTypes = {
        latestPublicationsList: PropTypes.array,
        totalPublicationsCount: PropTypes.number,
        loadingLatestPublications: PropTypes.bool,
        accountAuthorDetailsLoading: PropTypes.bool,
        actions: PropTypes.object,
        history: PropTypes.object.isRequired,
        classes: PropTypes.object
    };

    static defaultProps = {
        latestPublicationsList: [],
        totalPublicationsCount: null,
        loadingLatestPublications: false
    };

    componentDidMount() {
        if (!this.props.accountAuthorDetailsLoading) {
            this.props.actions.searchLatestPublications();
        }
    }

    _viewMyResearch = () => {
        this.props.history.push(routes.pathConfig.records.mine);
    };

    render() {
        const txt = locale.components.myLatestPublications;

        if (this.props.loadingLatestPublications) {
            return (
                <div className="isLoading is-centered">
                    <InlineLoader message={txt.loading}/>
                </div>
            );
        }

        return (
            <div className="latestPubs">
                <PublicationsList
                    publicationsList={this.props.latestPublicationsList}
                    showDefaultActions/>
                <Button
                    variant="contained"
                    onClick={this._viewMyResearch}
                    color="secondary"
                    className={this.props.classes.blueButton}
                >
                    {`${txt.viewAllButtonLabel} (${this.props.totalPublicationsCount})`}
                </Button>
            </div>
        );
    }
}

export default withStyles(styles)(MyLatestPublications);
