import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ContributorRowHeader from './ContributorRowHeader';
import ContributorRow from './ContributorRow';
import ContributorForm from './ContributorForm';
import {Alert} from 'uqlibrary-react-toolbox';

export default class ContributorsEditor extends Component {

    static propTypes = {
        showIdentifierLookup: PropTypes.bool,
        onChange: PropTypes.func,
        locale: PropTypes.object
    };

    static defaultProps = {
        showIdentifierLookup: false,
        locale: {
            errorMessage: 'Unable to add an item with the same identifier.'
        }
    };

    constructor(props) {
        super(props);

        this.state = {
            contributors: [],
            errorMessage: ''
        };
    }

    componentWillUpdate(nextProps, nextState) {
        // notify parent component when local state has been updated, eg contributors added/removed/reordered
        if (this.props.onChange) this.props.onChange(nextState.contributors);
    }

    addContributor = (contributor) => {
        // only unique identifiers can be added
        if (this.state.contributors.filter(item => {
            return !!contributor.aut_id && item.aut_id === contributor.aut_id;
        }).length > 0) {
            this.setState({
                errorMessage: this.props.locale.errorMessage
            });
        } else {
            this.setState({
                contributors: [ ...this.state.contributors, contributor],
                errorMessage: ''
            });
        }
    }

    moveUpContributor = (contributor, index) => {
        if (index === 0) return;
        const nextContributor = this.state.contributors[index - 1];
        this.setState({
            contributors: [
                ...this.state.contributors.slice(0, index - 1),
                contributor, nextContributor,
                ...this.state.contributors.slice(index + 1)]
        });
    }

    moveDownContributor = (contributor, index) => {
        if (index === (this.state.contributors.length - 1)) return;
        const nextContributor = this.state.contributors[index + 1];
        this.setState({
            contributors: [
                ...this.state.contributors.slice(0, index),
                nextContributor, contributor,
                ...this.state.contributors.slice(index + 2)]
        });
    }

    deleteContributor = (contributor, index) => {
        this.setState({
            contributors: this.state.contributors.filter((_, i) => i !== index)
        });
    }

    deleteAllContributors = () => {
        this.setState({contributors: []});
    }

    render() {
        const renderContributorsRows = this.state.contributors.map((contributor, index) =>
            <ContributorRow
                key={index}
                index={index}
                contributor={contributor}
                canMoveDown={index !== this.state.contributors.length - 1}
                canMoveUp={index !== 0}
                onMoveUp={this.moveUpContributor}
                onMoveDown={this.moveDownContributor}
                onDelete={this.deleteContributor}
                showIdentifierLookup={this.props.showIdentifierLookup}
                contributorSuffix={this.props.locale.contributorSuffix}
            />
        );

        return (
            <div>
                <ContributorForm
                    onAdd={this.addContributor}
                    showIdentifierLookup={this.props.showIdentifierLookup}
                />
                {this.state.errorMessage &&
                    <Alert
                        title="Error!"
                        message={this.state.errorMessage}
                        type="warning" />}

                {this.state.contributors.length > 0 &&
                    <ContributorRowHeader
                        onDeleteAll={this.deleteAllContributors}
                        showIdentifierLookup={this.props.showIdentifierLookup}
                    />}

                {renderContributorsRows}
            </div>
        );
    }
}
