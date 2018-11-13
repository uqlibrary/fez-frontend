import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {TextField} from 'modules/SharedComponents/Toolbox/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import {UqIdField} from 'modules/SharedComponents/LookupFields';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from 'actions/authors';

export class ContributorForm extends PureComponent {
    static propTypes = {
        authorsList: PropTypes.array.isRequired,
        onAdd: PropTypes.func.isRequired,
        showIdentifierLookup: PropTypes.bool,
        showAffiliation: PropTypes.bool,
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
            identifierHint: '',
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
            contributor: {},
            affiliation: ''
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
            contributor: {},
            affiliation: ''
        });
    };

    _onNameChanged = (event) => {
        this.setState({
            nameAsPublished: event.target.value
        });
    };
    _onAffChanged = (event) => {
        const value = event.target.value.replace('%', '');
        this.setState({
            affiliation: value + '%'
        });
    };


    _onUQIdentifierSelected = (selectedItem) => {
        this.setState({
            contributor: selectedItem
        }, () => {
            this._addContributor();
        });
    };

    _onUQIdentifierChanged = (newValue) => {
        console.log(newValue);
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
            <div style={{flexGrow: 1}}>
                {description}
                <Grid container spacing={8} alignItems={'flex-end'} alignContent={'flex-end'}>
                    <Grid item xs={12} sm>
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
                    <Grid item xs={12} sm={2}>
                        <TextField
                            fullWidth
                            label={'Affiliation value'}
                            placeholder={'1% - 100%'}
                            value={this.state.affiliation}
                            onChange={this._onAffChanged}
                            disabled={!this.state.nameAsPublished}
                            autoComplete="off"
                        />
                    </Grid>
                </Grid>
                <Grid container spacing={8} alignItems={'flex-end'} alignContent={'flex-end'}>
                    <Grid item xs={12} sm>
                        <TextField
                            fullWidth
                            label={'Affiliation ID'}
                            disabled={!this.state.nameAsPublished}
                            autoComplete="off"
                        />
                    </Grid>
                    <Grid item xs={12} sm>
                        <TextField
                            fullWidth
                            label={'Affiliation country'}
                            disabled={!this.state.nameAsPublished}
                            autoComplete="off"
                        />
                    </Grid>
                    <Grid item xs={12} sm>
                        <UqIdField
                            label={this.props.locale.identifierLabel}
                            placeholder={this.props.locale.identifierHint}
                            value={this.state.uqIdentifier}
                            disabled={this.props.disabled || this.state.nameAsPublished.trim().length === 0}
                            onChange={this._onUQIdentifierSelected}
                            ref="identifierField"
                            id="identifierField"
                        />
                    </Grid>
                    <Grid item xs={'auto'}>
                        <Button
                            variant="contained"
                            fullWidth
                            color="primary"
                            disabled={this.props.disabled || this.state.nameAsPublished.trim().length === 0}
                            onClick={this._addContributor}
                        >
                            Add author
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
