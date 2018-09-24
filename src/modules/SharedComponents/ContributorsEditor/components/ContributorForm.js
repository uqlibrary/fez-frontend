import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {TextField} from 'modules/SharedComponents/Toolbox/TextField';
import {Grid, Button} from '@material-ui/core';
import {UqIdField} from 'modules/SharedComponents/LookupFields';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from 'actions/authors';

export class ContributorForm extends PureComponent {
    static propTypes = {
        authorsList: PropTypes.array.isRequired,
        onAdd: PropTypes.func.isRequired,
        showIdentifierLookup: PropTypes.bool,
        errorText: PropTypes.string,
        actions: PropTypes.object.isRequired,
        locale: PropTypes.object,
        disabled: PropTypes.bool,
        showContributorAssignment: PropTypes.bool,
        required: PropTypes.bool
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
    }

    _onNameChanged = (event) => {
        this.setState({
            nameAsPublished: event.target.value
        });
    }

    _onUQIdentifierSelected = (selectedItem) => {
        this.setState({
            contributor: selectedItem
        }, () => {
            this._addContributor();
        });
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
        const description = this.props.showContributorAssignment ? this.props.locale.descriptionStep1 : this.props.locale.descriptionStep1NoStep2;
        return (
            <div style={{flexGrow: 1, padding: 8}}>
                {description}
                <Grid container spacing={16} alignItems="baseline">
                    <Grid item xs={12} sm={this.props.showIdentifierLookup ? 12 : 9} md={this.props.showIdentifierLookup ? 5 : 10}>
                        <TextField
                            fullWidth
                            ref="nameAsPublishedField"
                            id="nameAsPublishedField"
                            label={this.props.locale.nameAsPublishedLabel}
                            helperText={this.props.locale.nameAsPublishedHint}
                            value={this.state.nameAsPublished}
                            onChange={this._onNameChanged}
                            onKeyPress={this._addContributor}
                            disabled={this.props.disabled}
                            required={this.props.required}
                            autoComplete="off"
                        />
                    </Grid>
                    {
                        this.props.showIdentifierLookup &&
                        <Grid item xs={12} sm={12} md={5}>
                            <UqIdField
                                disabled={this.props.disabled || this.state.nameAsPublished.trim().length === 0}
                                onChange={this._onUQIdentifierSelected}
                                ref="identifierField"
                                id="identifierField"
                            />
                        </Grid>
                    }
                    <Grid item xs={12} sm={3} md={2}>
                        <Button
                            variant="contained"
                            fullWidth
                            color="primary"
                            disabled={this.props.disabled || this.state.nameAsPublished.trim().length === 0}
                            onClick={this._addContributor}
                        >
                            {this.props.locale.addButton}
                        </Button>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        authorsList: state && state.get('authorsReducer') ? state.get('authorsReducer').authorsList : []
    };
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ContributorForm);
