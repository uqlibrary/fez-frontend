import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ContentLink from 'material-ui/svg-icons/content/link';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import KeyboardUp from 'material-ui/svg-icons/hardware/keyboard-arrow-up';
import KeyboardDown from 'material-ui/svg-icons/hardware/keyboard-arrow-down';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import AutoComplete from 'material-ui/AutoComplete';

import {locale} from 'config';

import './AddAuthors.scss';

let LAST_ROW = 1;

export default class AddAuthors extends Component {

    static propTypes = {
        authorsList: PropTypes.object,
        authorsSearchResults: PropTypes.object,
        clearAuthorsSearchResults: PropTypes.func,
        clearIdentifiersSearchResults: PropTypes.func,
        identifiersSearchResults: PropTypes.object,
        searchFromAuthorsField: PropTypes.func,
        searchFromIdentifiersField: PropTypes.func,
        updateAuthorsList: PropTypes.func
    };

    constructor(props) {
        super(props);

        this.state = {
            deleteSingleAuthor: true,
            deleteAuthorIndex: -1,
            deleteDialogContent: '',
            deleteDialogOpen: false,
            error: '',
            identifier: '',
            identifierLabel: '',
            name: '',
            nameError: '',
            nameTimeout: null,
            showIdentifierField: false
        };
    }

    componentDidMount() {
        // TODO: fix this hack! it makes me wannacry! UGLY HACK!
        // I need to catch scrolling event of scrolled container (which is not a window) to set position of autosuggest list when user scrolls
        // another solution, close the box when user tries to scroll
        const div = document.querySelector('div.layout-fill.align-stretch');
        div.addEventListener('scroll', this.handleParentContainerScroll.bind(this));
    }

    handleParentContainerScroll() {
        if (this.refs.authorInput) this.refs.authorInput.close();
        if (this.refs.authorIdInput) this.refs.authorIdInput.close();
    }

    addAuthor = () => {
        const authorInformation = locale.sharedComponents.authors;
        const authorFields = authorInformation.fields;
        const messages = authorInformation.messages;
        const {clearAuthorsSearchResults, clearIdentifiersSearchResults, updateAuthorsList} = this.props;
        const authorsList = this.props.authorsList.toJS();

        let errorMessage = '';
        let found = false;

        if (this.state.identifier !== '' && authorsList) {
            found = authorsList.filter(author => author.identifier === this.state.identifier).length > 0;
        }

        if (!found) {
            const newAuthor = {
                name: this.state.name,
                identifier: this.state.identifier,
                identifierLabel: this.state.identifierLabel
            };

            authorsList.push(newAuthor);

            // update the the authors reducer
            updateAuthorsList(authorsList);
        } else {
            errorMessage = messages.authorIdentifierExists;
        }

        this.setState({
            error: errorMessage,
            identifier: '',
            identifierLabel: '',
            name: '',
            nameError: '',
            showIdentifierField: false
        });

        clearAuthorsSearchResults();
        clearIdentifiersSearchResults();

        // tried using the other ways recommended by facebook with refs but they didn't work
        document.getElementsByName(authorFields.authorName)[0].focus();
    };

    buildAuthorRow = () => {
        const authorInformation = locale.sharedComponents.authors;
        const authorOrdinalInfo = authorInformation.ordinalData;
        const authorRowInfo = authorInformation.rows;
        const authorConstants = authorInformation.constants;
        const authorsList = this.props.authorsList;

        LAST_ROW = authorsList.size;

        return (
             authorsList.map((author, index) => {
                 const key = `${author}${index}`;

                 const authorOrderText = authorOrdinalInfo.list[index] ?
                     `${authorOrdinalInfo.list[index]} ${authorOrdinalInfo.suffix}` :
                     `${authorOrdinalInfo.default} ${authorOrdinalInfo.suffix}`;

                 return (
                    <div key={key} className="columns is-gapless is-mobile is-record is-authors">
                        <div className="column is-7-desktop is-7-tablet is-6-mobile is-author">
                            {author.get('name')}
                            <div className="priority-author">
                                {authorOrderText}
                            </div>
                        </div>
                        <div className="column is-2-desktop is-2-tablet is-5-mobile is-uqid">{author.get('identifierLabel')}</div>
                        <div className="column is-2-desktop is-2-tablet is-0-mobile is-reorder">
                            <IconButton tooltip={authorRowInfo.moveRecordUp} disabled={index === authorConstants.firstRow} onClick={() => this.moveAuthorUp(index)}>
                                <KeyboardUp />
                            </IconButton>
                            <IconButton tooltip={authorRowInfo.moveRecordDown} disabled={(index + 1) === LAST_ROW} onClick={() => this.moveAuthorDown(index)}>
                                <KeyboardDown />
                            </IconButton>
                        </div>
                        <div className="column is-1-desktop is-1-tablet is-1-mobile is-delete">
                            <IconButton tooltip={authorRowInfo.removeRecord} onClick={() => this.deleteAuthorConfirmation(index)}>
                                <FontIcon className="material-icons deleteIcon">delete</FontIcon>
                            </IconButton>
                        </div>
                    </div>
                 );
             })
        );
    };

    deleteAuthorAction = () => {
        let authorsList = this.props.authorsList.toJS();

        if (this.state.deleteSingleAuthor) {
            authorsList.splice(this.state.deleteAuthorIndex, 1);
        } else {
            authorsList = [];
        }

        // update the the authors reducer
        this.props.updateAuthorsList(authorsList);
        this.handleDialogClose();
    };

    deleteAllAuthorsConfirmation = () => {
        const authorInformation = locale.sharedComponents.authors;
        const messages = authorInformation.messages;

        this.setState({
            deleteSingleAuthor: false,
            deleteAuthorIndex: -1,
            deleteDialogOpen: true,
            deleteDialogContent: messages.deleteAllAuthorsDialogContent
        });
    };

    deleteAuthorConfirmation = (index) => {
        const authorInformation = locale.sharedComponents.authors;
        const messages = authorInformation.messages;

        this.setState({
            deleteSingleAuthor: true,
            deleteAuthorIndex: index,
            deleteDialogOpen: true,
            deleteDialogContent: messages.deleteAuthorDialogContent
        });
    };

    handleDialogClose = () => {
        this.setState({
            deleteSingleAuthor: true,
            deleteAuthorIndex: -1,
            deleteDialogOpen: false,
            deleteDialogContent: ''
        });
    };

    handleNameChangeAutoComplete = (value) => {
        if (value.length === 0) {
            this.setState({showIdentifierField: false});
        } else {
            this.props.searchFromAuthorsField(value);
        }

        this.setState({name: value});
    };

    handleNameDropdown = (selectedMenuItem, index) => {
        const authorInformation = locale.sharedComponents.authors;
        const authorFields = authorInformation.fields;
        const authorConstants = authorInformation.constants;

        // only process the name if there is at least one character
        if (this.state.name.trim().length > 0) {
            if (index > authorConstants.autoCompleteFirstOption) {
                this.setState({
                    identifier: selectedMenuItem.identifier,
                    name: selectedMenuItem.name,
                    identifierLabel: `(${selectedMenuItem.name} - ${selectedMenuItem.identifier})`
                });
                this.addAuthor();
            } else {
                const name = (index === authorConstants.autoCompleteFirstOption) ? selectedMenuItem.name : this.state.name;

                this.setState({
                    name,
                    showIdentifierField: true
                });

                this.searchForIdentifier(authorFields.authorIdentifier);
            }
        }
    };

    // this is needed because handleNameAction can't handle tab key presses
    handleNameKeyDown = (e) => {
        const authorInformation = locale.sharedComponents.authors;
        const authorConstants = authorInformation.constants;

        if (e.key === authorConstants.tabKey) {
            e.preventDefault();
            const authorFields = authorInformation.fields;
            this.setState({showIdentifierField: true});
            this.searchForIdentifier(authorFields.authorIdentifier, this.state.identifier);
        }
    };

    handleIdentifierChangeAutoComplete = (value) => {
        const authorInformation = locale.sharedComponents.authors;
        const authorFields = authorInformation.fields;

        this.setState({identifier: value});
        this.searchForIdentifier(authorFields.authorIdentifier, value);
    };

    handleIdentifierDropdown = (selectedMenuItem, index) => {
        const authorInformation = locale.sharedComponents.authors;
        const authorConstants = authorInformation.constants;

        // we can add an author without an identifier
        if ((index === authorConstants.autoCompleteEnterKey) ||
            (index >= authorConstants.autoCompleteFirstOption)) {
            this.setState({
                identifier: selectedMenuItem.identifier,
                identifierLabel: `(${selectedMenuItem.name} - ${selectedMenuItem.identifier})`
            });
            this.addAuthor();
        }
    };

    handleIdentifierKeyPress = (e) => {
        const authorInformation = locale.sharedComponents.authors;
        const authorConstants = authorInformation.constants;

        if (e.key === authorConstants.enterKey) {
            e.preventDefault();
            if (this.state.name.trim().length > 0) {
                this.addAuthor();
            } else {
                const authorInformation = locale.sharedComponents.authors;
                const messages = authorInformation.messages;

                this.setState({nameError: messages.authorNameMissing});
            }
        }
    };

    moveAuthorDown = (currentIndex) => {
        if ((currentIndex + 1) < LAST_ROW) {
            this.reorderAuthor(currentIndex, currentIndex + 1);
        }
    };

    moveAuthorUp = (currentIndex) => {
        const authorInformation = locale.sharedComponents.authors;
        const authorConstants = authorInformation.constants;

        if (currentIndex > authorConstants.firstRow) {
            this.reorderAuthor(currentIndex, currentIndex - 1);
        }
    };

    reorderAuthor = (oldIndex, newIndex) => {
        const authorsList = this.props.authorsList.toJS();
        const currentAuthor = authorsList[oldIndex];

        authorsList[oldIndex] = authorsList[newIndex];
        authorsList[newIndex] = currentAuthor;

        // update the the authors reducer
        this.props.updateAuthorsList(authorsList);
    };

    formatDataSourceForAuthors = () => {
        const authorInformation = locale.sharedComponents.authors;
        const authorFields = authorInformation.fields;

        const searchResults = this.props.authorsSearchResults.toJS();
        const currentItem = [{
            label: `${authorFields.autoCompleteFirstEntryLabel} ${this.state.name}`,
            name: this.state.name
        }];

        return currentItem.concat(searchResults);
    };

    searchForIdentifier = (field, name) => {
        const self = this;
        // need to add this timeout otherwise the document.getElement... call will be undefined
        setTimeout(() => {
            // populate the potential authors in the identifiers autocomplete
            if (name && name.length > 0) {
                self.props.searchFromIdentifiersField(name);
            }

            // tried using the other ways recommended by facebook with refs but they didn't work
            if (document.getElementsByName(field)[0]) {
                document.getElementsByName(field)[0].focus();
            }
        }, 50);
    };

    render() {
        const authorInformation = locale.sharedComponents.authors;
        const authorButtonFields = authorInformation.buttons;
        const authorFields = authorInformation.fields;
        const authorsList = this.props.authorsList;
        const buttonLabels = locale.global.labels.buttons;

        const deleteActions = [
            <FlatButton
                label={buttonLabels.cancel}
                onTouchTap={this.handleDialogClose}
            />,
            <RaisedButton
                label={buttonLabels.delete}
                secondary
                keyboardFocused
                style={{marginLeft: '12px'}}
                onTouchTap={this.deleteAuthorAction}
            />,
        ];

        const authorsDataSource = this.formatDataSourceForAuthors();
        const dataSourceConfig = {text: 'label', value: 'name'};

        return (
            <div className="is-authors">
                {/* Dialog */}
                <Dialog
                    actions={deleteActions}
                    modal={false}
                    open={this.state.deleteDialogOpen}
                    onRequestClose={this.handleDialogClose}
                >
                    {this.state.deleteDialogContent}
                </Dialog>
                {/* Input area */}
                <div className="columns" style={{marginTop: '-20px'}}>
                    <div className="column is-addAuthor">
                        <AutoComplete
                            ref="authorInput"
                            name={authorFields.authorName}
                            floatingLabelText={authorFields.authorNameLabel}
                            fullWidth
                            filter={AutoComplete.fuzzyFilter}
                            openOnFocus={this.state.name.length > 0}
                            dataSource={authorsDataSource}
                            dataSourceConfig={dataSourceConfig}
                            maxSearchResults={authorInformation.limit}
                            onUpdateInput={this.handleNameChangeAutoComplete}
                            onNewRequest={this.handleNameDropdown}
                            onKeyDown={this.handleNameKeyDown}
                            errorText={this.state.nameError}
                            value={this.state.name}
                        />
                    </div>
                    {this.state.showIdentifierField && (
                        <div className="column is-narrow linkIcon">
                            <ContentLink className="iconLink"/>
                        </div>
                    )}
                    {this.state.showIdentifierField && (
                    <div className="column is-addUQid">
                        <AutoComplete
                            ref="authorIdInput"
                            name={authorFields.authorIdentifier}
                            floatingLabelText={authorFields.authorIdentifierLabel}
                            filter={AutoComplete.fuzzyFilter}
                            openOnFocus
                            fullWidth
                            maxSearchResults={authorInformation.limit}
                            dataSource={this.props.identifiersSearchResults.toJS()}
                            dataSourceConfig={dataSourceConfig}
                            onUpdateInput={this.handleIdentifierChangeAutoComplete}
                            onNewRequest={this.handleIdentifierDropdown}
                            onKeyPress={this.handleIdentifierKeyPress}
                            value={this.state.identifier}
                        />
                    </div>
                    )}
                    <div className="column is-narrow">
                        <RaisedButton
                            label={authorButtonFields.addAuthorLabel}
                            primary
                            className="authorAddButton"
                            disabled={this.state.name.trim().length === 0}
                            onClick={this.addAuthor} />
                    </div>
                </div>
                {/* Error */}
                {this.state.error && (
                <div className="columns is-authors">
                    <div className="column errorMessage">
                        {this.state.error}
                    </div>
                </div>
                )}

                {/* List area */}
                {authorsList && authorsList.size > 0 && (
                    <div className="metadata-container is-authors">
                        <div className="columns is-gapless is-mobile headers">
                            <div className="column is-7-desktop is-7-tablet is-6-mobile header is-author">Author name</div>
                            <div className="column is-2-desktop is-2-tablet is-5-mobile header is-uqid">UQ identifier</div>
                            <div className="column is-2-desktop is-2-tablet is-0-mobile header is-reorder">&nbsp;&nbsp;&nbsp;&nbsp;Reorder</div>
                            <div className="column is-1-desktop is-1-tablet is-1-mobile header is-delete">
                                <IconButton
                                    tooltip={authorButtonFields.removeAllLabel}
                                    onClick={this.deleteAllAuthorsConfirmation}>
                                    <FontIcon className="material-icons deleteIcon">delete_forever</FontIcon>
                                </IconButton>
                            </div>
                        </div>

                        <div>
                            {this.buildAuthorRow()}
                        </div>
                    </div>
                )}
            </div>

        );
    }
}

