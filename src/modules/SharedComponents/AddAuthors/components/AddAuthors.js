import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ContentLink from 'material-ui/svg-icons/content/link';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import ActionDeleteAll from 'material-ui/svg-icons/action/delete-forever';
import FlatButton from 'material-ui/FlatButton';
import KeyboardUp from 'material-ui/svg-icons/hardware/keyboard-arrow-up';
import KeyboardDown from 'material-ui/svg-icons/hardware/keyboard-arrow-down';
import RaisedButton from 'material-ui/RaisedButton';
import IconButton from 'material-ui/IconButton';
import Dialog from 'material-ui/Dialog';
import AutoComplete from 'material-ui/AutoComplete';

import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';

import {locale} from 'config';

const iconStyles = {
    marginTop: '35px',
    color: '#CCC'
};
const buttonStyles = {
    marginTop: '30px'
};

const listStyle = {
    opacity: 0.3,
    zIndex: 999
};

const hoveredListstyle = {
    opacity: 0.9,
    zIndex: 999
};

const actionRowStyle = {
    overflow: 'visible',
    width: '50px'
};

let LAST_ROW = 1;

export default class AddAuthors extends Component {

    static propTypes = {
        authorsList: PropTypes.object,
        authorsSearchResults: PropTypes.object,
        clearAuthorsSearchResults: PropTypes.func,
        clearIdentifiersSearchResults: PropTypes.func,
        identifiersSearchResults: PropTypes.object,
        searchForAuthors: PropTypes.func,
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
            name: '',
            nameError: '',
            nameTimeout: null,
            showIdentifierField: false
        };
    }

    addAuthor = () => {
        const authorInformation = locale.sharedComponents.authors;
        const authorFields = authorInformation.fields;
        const messages = authorInformation.messages;
        const authorsList = this.props.authorsList.toJS();
        const {clearAuthorsSearchResults, clearIdentifiersSearchResults} = this.props;

        let errorMessage = '';
        let found = false;
        if (this.state.identifier.length > 0 && authorsList) {
            found = authorsList.filter(author => author.identifier === this.state.identifier).length > 0;
        }

        if (!found) {
            const newAuthor = {
                name: this.state.name,
                identifier: this.state.identifier
            };

            authorsList.push(newAuthor);

            // update the the authors reducer
            this.props.updateAuthorsList(authorsList);
        } else {
            errorMessage = messages.authorExists;
        }

        this.setState({
            error: errorMessage,
            identifier: '',
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
                    <TableRow key={key}>
                        <TableRowColumn>
                            {author.get('name')}
                            <div className="priority-author">
                                {authorOrderText}
                            </div>
                        </TableRowColumn>
                        <TableRowColumn>{author.get('identifier')}</TableRowColumn>
                        <TableRowColumn style={actionRowStyle}>
                            <IconButton tooltip={authorRowInfo.moveRecordUp} disabled={index === authorConstants.firstRow} iconStyle={listStyle} hoveredStyle={hoveredListstyle} onClick={() => this.moveAuthorUp(index)}>
                                <KeyboardUp />
                            </IconButton>
                            <IconButton tooltip={authorRowInfo.moveRecordDown} disabled={(index + 1) === LAST_ROW} iconStyle={listStyle} hoveredStyle={hoveredListstyle} onClick={() => this.moveAuthorDown(index)}>
                                <KeyboardDown />
                            </IconButton>
                        </TableRowColumn>
                        <TableRowColumn style={actionRowStyle}><IconButton tooltip={authorRowInfo.removeRecord} iconStyle={listStyle} hoveredStyle={hoveredListstyle} onClick={() => this.deleteAuthorConfirmation(index)}><ActionDelete /></IconButton></TableRowColumn>
                    </TableRow>
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
        }
        this.props.searchForAuthors(value);

        this.setState({name: value});
    };

    handleNameAction = (selectedMenuItem, index) => {
        const authorInformation = locale.sharedComponents.authors;
        const authorFields = authorInformation.fields;
        const authorConstants = authorInformation.constants;

        if (index === authorConstants.autoCompleteEnterKey || index > authorConstants.autoCompleteFirstOption) {
            this.setState({
                identifier: selectedMenuItem.identifier,
                name: selectedMenuItem.name,
            });
            this.addAuthor();
        } else {
            if (index === authorConstants.autoCompleteFirstOption) {
                // this is the non-uq staff member name
                this.setState({
                    name: selectedMenuItem.name,
                    showIdentifierField: true
                });

                // populate the potential authors in the identifiers autocomplete
                this.props.searchFromIdentifiersField(selectedMenuItem.name);

                // tried using the other ways recommended by facebook with refs but they didn't work
                document.getElementsByName(authorFields.authorIdentifier)[0].focus();
            }
        }
    };

    handleIdentifierAction = (selectedMenuItem, index) => {
        const authorInformation = locale.sharedComponents.authors;
        const authorConstants = authorInformation.constants;

        // we can add an author without an identifier
        if ((index === authorConstants.autoCompleteEnterKey && this.state.identifier.length === 0) ||
            (index >= authorConstants.autoCompleteFirstOption)) {
            this.setState({
                identifier: selectedMenuItem.identifier
            });
            this.addAuthor();
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
        const searchResults = this.props.authorsSearchResults.toJS();
        const currentItem = [{
            label: `Add author as entered: ${this.state.name}`,
            name: this.state.name
        }];

        return currentItem.concat(searchResults);
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
            <div>
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
                <div className="columns">
                    <div className="column">
                        <AutoComplete
                            name={authorFields.authorName}
                            floatingLabelText={authorFields.authorNameLabel}
                            fullWidth
                            dataSource={authorsDataSource}
                            dataSourceConfig={dataSourceConfig}
                            onUpdateInput={this.handleNameChangeAutoComplete}
                            onNewRequest={this.handleNameAction}
                            errorText={this.state.nameError}
                            value={this.state.name}
                        />
                    </div>
                    {this.state.showIdentifierField && (
                    <div className="column is-narrow">
                        <ContentLink style={iconStyles}/>
                    </div>
                    )}
                    {this.state.showIdentifierField && (
                    <div className="column">
                        <AutoComplete
                            name={authorFields.authorIdentifier}
                            floatingLabelText={authorFields.authorIdentifierLabel}
                            openOnFocus
                            fullWidth
                            dataSource={this.props.identifiersSearchResults.toJS()}
                            dataSourceConfig={dataSourceConfig}
                            onNewRequest={this.handleIdentifierAction}
                            value={this.state.identifier}
                        />
                    </div>
                    )}
                    <div className="column is-narrow">
                        <RaisedButton
                            label={authorButtonFields.addAuthorLabel}
                            primary
                            style={buttonStyles}
                            disabled={this.state.name.trim().length === 0}
                            onClick={this.addAuthor} />
                    </div>
                </div>
                {/* Error */}
                {this.state.error && (
                <div className="columns">
                    <div className="column">
                        {this.state.error}
                    </div>
                </div>
                )}

                {/* List area */}
                {authorsList && authorsList.size > 0 && (
                <div className="columns">
                    <div className="column">
                        <Table selectable={false} >
                            <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                                <TableRow>
                                    <TableHeaderColumn>Name</TableHeaderColumn>
                                    <TableHeaderColumn>UQ identifier</TableHeaderColumn>
                                    <TableHeaderColumn style={actionRowStyle}>Reorder</TableHeaderColumn>
                                    <TableHeaderColumn style={actionRowStyle}>
                                        <IconButton tooltip="Remove all authors" iconStyle={listStyle} hoveredStyle={hoveredListstyle} onClick={this.deleteAllAuthorsConfirmation}><ActionDeleteAll /></IconButton>
                                    </TableHeaderColumn>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {this.buildAuthorRow()}
                            </TableBody>
                        </Table>
                    </div>
                </div>
                )}
            </div>

        );
    }
}

