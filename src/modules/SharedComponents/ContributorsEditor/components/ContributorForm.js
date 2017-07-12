import React, {Component} from 'react';
import PropTypes from 'prop-types';
import AutoComplete from 'material-ui/AutoComplete';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

import {connect} from 'react-redux';
import {searchAuthors} from 'actions';

class ContributorForm extends Component {

    static propTypes = {
        authorsList: PropTypes.array,
        onAdd: PropTypes.func.isRequired,
        dispatch: PropTypes.func
    };

    constructor(props) {
        super(props);

        this.state = {
            nameAsPublished: '',
            uqIdentifier: '',
            contributor: {}
        };

        this._addContributor = this._addContributor.bind(this);
        this._onNameChanged = this._onNameChanged.bind(this);
        this._onUQIdentifierChanged = this._onUQIdentifierChanged.bind(this);
        this._onUQIdentifierSelected = this._onUQIdentifierSelected.bind(this);
    }

    componentDidMount() {
        // TODO: fix this hack! it makes me wannacry! UGLY HACK!
        // I need to catch scrolling event of scrolled container (which is not a window) to set position of autosuggest list when user scrolls
        // another solution, close the box when user tries to scroll
        const div = document.querySelector('div.layout-fill.align-stretch');
        div.addEventListener('scroll', this.handleParentContainerScroll.bind(this));
    }

    componentWillUnmount() {
    }

    handleParentContainerScroll() {
        if (this.refs.identifierField) this.refs.identifierField.close();
    }

    _addContributor() {
        // pass on the selected contributor
        this.props.onAdd({...this.state.contributor, ...{nameAsPublished: this.state.nameAsPublished}});

        // reset internal state
        this.setState({
            nameAsPublished: '',
            uqIdentifier: '',
            contributor: {}
        });

        // move focus to name as published text field after item was added
        this.refs.nameAsPublishedField.focus();
    }

    _onNameChanged(event, newValue) {
        this.setState({
            nameAsPublished: newValue
        });
    }

    _onUQIdentifierSelected(selectedItem, index) {
        // items has to be selected from the list
        if (index === -1) return;

        this.setState({
            contributor: selectedItem
        });

        this._addContributor();
    }

    _onUQIdentifierChanged(newValue) {
        this.setState({
            uqIdentifier: newValue
        });

        if (newValue.trim().length > 1) {
            this.props.dispatch(searchAuthors(newValue, (item) => { return !!item.aut_org_username; }));
        }
    }

    render() {
        const autoCompleteDataFormat = {text: 'displayName', value: 'aut_id'};

        return (
            <div className="columns">
                <div className="column is-5-desktop is-5-tablet is-12-mobile">
                    <TextField
                        fullWidth
                        ref="nameAsPublishedField"
                        floatingLabelText="Name as published"
                        hintText="Name as published"
                        value={this.state.nameAsPublished}
                        onChange={this._onNameChanged}
                        onKe
                    />
                </div>
                <div className="column is-5-desktop is-5-tablet is-12-mobile">
                    <AutoComplete
                        disabled={this.state.nameAsPublished.trim().length === 0}
                        listStyle={{maxHeight: 200, overflow: 'auto'}}
                        filter={() => true}
                        ref="identifierField"
                        floatingLabelText="UQ identifier (if available)"
                        hintText="UQ identifier (if available)"
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
                <div className="column is-1-desktop is-1-tablet is-12-mobile is-centered">
                    <RaisedButton
                        primary
                        label="Add"
                        disabled={this.state.nameAsPublished.trim().length === 0}
                        onClick={this._addContributor} />
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        authorsList: state.get('authorsReducer2').authorsList || []
    };
};

export default connect(mapStateToProps)(ContributorForm);
