import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import param from 'can-param';

import Snackbar from 'material-ui/Snackbar';
import {routes} from 'config';

import SimpleSearchComponent from './SimpleSearchComponent';
import AdvancedSearchComponent from './AdvancedSearchComponent';

export default class SearchComponent extends PureComponent {
    static propTypes = {
        searchQueryParams: PropTypes.object,

        showSearchButton: PropTypes.bool,
        showMobileSearchButton: PropTypes.bool,
        showAdvancedSearchButton: PropTypes.bool,
        showPrefixIcon: PropTypes.bool,

        isInHeader: PropTypes.bool,
        isAdvancedSearch: PropTypes.bool,
        isAdvancedSearchMinimised: PropTypes.bool,
        isOpenAccessInAdvancedMode: PropTypes.bool,

        className: PropTypes.string,
        actions: PropTypes.object,
        history: PropTypes.object.isRequired,
    };

    static defaultProps = {
        searchQueryParams: {},

        showSearchButton: false,
        showMobileSearchButton: false,
        showAdvancedSearchButton: false,
        showPrefixIcon: false,

        isInHeader: false,
        isAdvancedSearch: false,
        isAdvancedSearchMinimised: false,
        isOpenAccessInAdvancedMode: false
    };

    constructor(props) {
        super(props);
        this.state = {
            snackbarOpen: false,
            snackbarMessage: '',
            isAdvancedSearch: props.isAdvancedSearch
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            isAdvancedSearch: nextProps.isAdvancedSearch,
            isAdvancedSearchMinimised: nextProps.isAdvancedSearch
        });
    }

    handleSearch = (searchQuery) => {
        if (searchQuery && this.props.actions && this.props.actions.searchEspacePublications) {
            this.props.actions.searchEspacePublications(searchQuery);

            // navigate to search results page
            this.props.history.push({
                pathname: routes.pathConfig.records.search,
                search: param(searchQuery),
                state: {...searchQuery}
            });
        }
    };

    toggleSearchMode = () => {
        this.setState({
            isAdvancedSearch: !this.state.isAdvancedSearch,
            isAdvancedSearchMinimised: false
        });
    };

    displaySnackbar = (message) => {
        this.setState({
            snackbarMessage: message,
            snackbarOpen: true
        });
    };

    hideSnackbar = () => {
        this.setState({
            snackbarOpen: false
        });
    };

    render() {
        return (
            <React.Fragment>
                {
                    (!this.state.isAdvancedSearch || this.props.isInHeader) &&
                    <SimpleSearchComponent
                        className={this.props.className}
                        isInHeader={this.props.isInHeader}
                        searchQueryParams={this.props.searchQueryParams}
                        showSearchButton={this.props.showSearchButton}
                        showMobileSearchButton={this.props.showMobileSearchButton}
                        showAdvancedSearchButton={this.props.showAdvancedSearchButton}
                        showPrefixIcon={this.props.showPrefixIcon}
                        onToggle={this.toggleSearchMode}
                        onSearch={this.handleSearch}
                        onInvalidSearch={this.displaySnackbar}
                    />
                }
                {
                    (this.state.isAdvancedSearch && !this.props.isInHeader) &&
                    <AdvancedSearchComponent
                        className={this.props.className}
                        searchQueryParams={this.props.searchQueryParams}
                        isOpenAccessInAdvancedMode={this.props.isOpenAccessInAdvancedMode}
                        isAdvancedSearchMinimised={this.state.isAdvancedSearchMinimised}
                        onToggle={this.toggleSearchMode}
                        onSearch={this.handleSearch}
                    />
                }
                <Snackbar
                    open={this.state.snackbarOpen}
                    autoHideDuration={5000}
                    message={this.state.snackbarMessage}
                />
            </React.Fragment>
        );
    }
}
