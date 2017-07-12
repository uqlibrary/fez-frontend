import React, {Component} from 'react';
// import PropTypes from 'prop-types';
import ContributorRowHeader from './ContributorRowHeader';
import ContributorRow from './ContributorRow';
import ContributorForm from './ContributorForm';
import AlertMessage from '../../AlertMessage';

export default class ContributorEditor extends Component {

    static propTypes = {

    };

    constructor(props) {
        super(props);

        this.deleteContributor = this.deleteContributor.bind(this);
        this.deleteAllContributors = this.deleteAllContributors.bind(this);
        this.moveUpContributor = this.moveUpContributor.bind(this);
        this.moveDownContributor = this.moveDownContributor.bind(this);
        this.addContributor = this.addContributor.bind(this);

        this.state = {
            contributors: [],
            errorMessage: ''
        };
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    addContributor(contributor) {
        if (this.state.contributors.filter(item => {
            return !!contributor.aut_id && item.aut_id === contributor.aut_id;
        }).length > 0) {
            // contributor with this identifier has been added, display error
            this.setState({
                errorMessage: 'Unable to add an item with the same identifier.'
            });
        } else {
            this.setState({
                contributors: [ ...this.state.contributors, contributor],
                errorMessage: ''
            });
        }
    }

    moveUpContributor(contributor, index) {
        if (index === 0) return;
        const nextContributor = this.state.contributors[index - 1];
        this.setState({
            contributors: [
                ...this.state.contributors.slice(0, index - 1),
                contributor, nextContributor,
                ...this.state.contributors.slice(index + 1)]
        });
    }

    moveDownContributor(contributor, index) {
        if (index === (this.state.contributors.length - 1)) return;
        const nextContributor = this.state.contributors[index + 1];
        this.setState({
            contributors: [
                ...this.state.contributors.slice(0, index),
                nextContributor, contributor,
                ...this.state.contributors.slice(index + 2)]
        });
    }

    deleteContributor(contributor, index) {
        this.setState({
            contributors: this.state.contributors.filter((_, i) => i !== index)
        });
    }

    deleteAllContributors() {
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
            />
        );

        return (
            <div>
                <ContributorForm onAdd={this.addContributor} />

                {this.state.errorMessage &&
                    <AlertMessage title="Error!" message={this.state.errorMessage} context="warning" />}

                {this.state.contributors.length > 0 &&
                    <ContributorRowHeader onDeleteAll={this.deleteAllContributors} />}

                {renderContributorsRows}
            </div>
        );
    }
}
