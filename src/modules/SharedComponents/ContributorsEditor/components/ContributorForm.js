import React, {Component} from 'react';
import PropTypes from 'prop-types';
import AutoComplete from 'material-ui/AutoComplete';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from 'actions/authors';

export class ContributorForm extends Component {
    static propTypes = {
        authorsList: PropTypes.array,
        onAdd: PropTypes.func.isRequired,
        showIdentifierLookup: PropTypes.bool,
        errorText: PropTypes.string,
        actions: PropTypes.object.isRequired,
        locale: PropTypes.object,
        disabled: PropTypes.bool,
        showContributorAssignment: PropTypes.bool
    };

    static defaultProps = {
        locale: {
            nameAsPublishedLabel: 'Name as published',
            nameAsPublishedHint: 'Please type the name exactly as published',
            identifierLabel: 'UQ identifier (if available)',
            addButton: 'Add author',
            descriptionStep1: (<div><span className="authorSteps">Step 1 of 2</span> - Please <b>add to a list of contributors below</b>, in the format and order that they are published.</div>),
            descriptionStep1NoStep2: (<div>Please <b>add to a list of contributors below</b>, in the format and order that they are published.</div>)
        }
    };

    constructor(props) {
        super(props);

        this.state = {
            nameAsPublished: '',
            uqIdentifier: '',
            contributor: {}
        };
    }

    _addContributor = (event) => {
        // add contributor if user hits 'enter' key on input field
        if(this.props.disabled || (event && event.key && (event.key !== 'Enter' || this.state.nameAsPublished.length === 0))) return;

        // pass on the selected contributor
        this.props.onAdd({...this.state.contributor, ...{nameAsPublished: this.state.nameAsPublished}});

        // reset internal state
        this.setState({
            nameAsPublished: '',
            uqIdentifier: '',
            contributor: {}
        });

        // move focus to name as published text field after item was added
        if (this.refs.nameAsPublishedField) this.refs.nameAsPublishedField.focus();
    }

    _onNameChanged = (event, newValue) => {
        this.setState({
            nameAsPublished: newValue
        });
    }

    _onUQIdentifierSelected = (selectedItem, index) => {
        // items has to be selected from the list
        if (index === -1) return;

        this.setState({
            contributor: selectedItem
        });

        this._addContributor();
    }

    _onUQIdentifierChanged = (newValue) => {
        this.setState({
            uqIdentifier: newValue
        });

        if (newValue.trim().length > 1) {
            this.props.actions.searchAuthors(newValue, (item) => { return !!item.aut_org_username; });
        }
    };

    render() {
        const autoCompleteDataFormat = {text: 'displayName', value: 'aut_id'};
        const description = this.props.showContributorAssignment ? this.props.locale.descriptionStep1 : this.props.locale.descriptionStep1NoStep2;

        return (
            <div>
                {description}
                <div className="columns">
                    <div className="column">
                        <TextField
                            fullWidth
                            ref="nameAsPublishedField"
                            id="nameAsPublishedField"
                            floatingLabelText={this.props.locale.nameAsPublishedLabel}
                            hintText={this.props.locale.nameAsPublishedHint}
                            value={this.state.nameAsPublished}
                            onChange={this._onNameChanged}
                            onKeyPress={this._addContributor}
                            disabled={this.props.disabled}
                            className="mui-long-labels-fix"
                        />
                    </div>
                    {
                        this.props.showIdentifierLookup &&
                        <div className="column">
                            <AutoComplete
                                disabled={this.props.disabled || this.state.nameAsPublished.trim().length === 0}
                                listStyle={{maxHeight: 200, overflow: 'auto'}}
                                filter={() => true}
                                ref="identifierField"
                                id="identifierField"
                                floatingLabelText={this.props.locale.identifierLabel}
                                hintText={this.props.locale.identifierLabel}
                                dataSource={this.props.authorsList}
                                dataSourceConfig={autoCompleteDataFormat}
                                openOnFocus
                                fullWidth
                                animated={false}
                                searchText={this.state.uqIdentifier}
                                onUpdateInput={this._onUQIdentifierChanged}
                                onNewRequest={this._onUQIdentifierSelected}
                            />
                        </div>
                    }
                    <div className="column is-narrow">
                        <RaisedButton
                            className="is-mui-spacing-button"
                            fullWidth
                            primary
                            label={this.props.locale.addButton}
                            disabled={this.props.disabled || this.state.nameAsPublished.trim().length === 0}
                            onClick={this._addContributor} />
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        authorsList: state.get('authorsReducer') ? state.get('authorsReducer').authorsList : []
    };
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ContributorForm);
