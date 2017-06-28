import React, {Component} from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import ContentLink from 'material-ui/svg-icons/content/link';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import KeyboardUp from 'material-ui/svg-icons/hardware/keyboard-arrow-up';
import KeyboardDown from 'material-ui/svg-icons/hardware/keyboard-arrow-down';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';

import {locale} from 'config';

import './AddAuthors.scss';

const FIRST_ROW = 0;
const ENTER_KEY = 'Enter';
let LAST_ROW = 1;

export default class AddAuthors extends Component {

    static propTypes = {
        authorsList: PropTypes.object,
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
            name: '',
            nameError: '',
            identifier: ''
        };
    }

    addAuthor = () => {
        const authorInformation = locale.sharedComponents.authors;
        const authorFields = authorInformation.fields;
        const messages = authorInformation.messages;
        const authorsList = this.props.authorsList.toJS();

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

            this.setState({
                name: '',
                identifier: '',
                error: '',
                nameError: ''
            });

            // update the the authors reducer
            this.props.updateAuthorsList(authorsList);
        } else {
            this.setState({
                name: '',
                identifier: '',
                error: messages.authorExists,
                nameError: ''
            });
        }

        // tried using the other ways recommended by facebook with refs but they didn't work
        document.getElementsByName(authorFields.authorName)[0].focus();
    };

    buildAuthorRow = () => {
        const authorInformation = locale.sharedComponents.authors;
        const authorOrdinalInfo = authorInformation.ordinalData;
        const authorRowInfo = authorInformation.rows;
        const authorsList = this.props.authorsList;

        LAST_ROW = authorsList.size;

        return (
             authorsList.map((author, index) => {
                 const key = `${author}${index}`;

                 const authorOrderText = authorOrdinalInfo.list[index] ?
                     `${authorOrdinalInfo.list[index]} ${authorOrdinalInfo.suffix}` :
                     `${authorOrdinalInfo.default} ${authorOrdinalInfo.suffix}`;

                 return (
                    <div key={key} className="columns is-gapless is-mobile is-record">
                        <div className="column is-7-desktop is-7-tablet is-6-mobile is-author">
                            {author.get('name')}
                            <div className="priority-author">
                                {authorOrderText}
                            </div>
                        </div>
                        <div className="column is-2-desktop is-2-tablet is-5-mobile is-uqid">{author.get('identifier')}</div>
                        <div className="column is-2-desktop is-2-tablet is-0-mobile is-reorder">
                            <IconButton tooltip={authorRowInfo.moveRecordUp} disabled={index === FIRST_ROW}   onClick={() => this.moveAuthorUp(index)}>
                                <KeyboardUp />
                            </IconButton>
                            <IconButton tooltip={authorRowInfo.moveRecordDown} disabled={(index + 1) === LAST_ROW}   onClick={() => this.moveAuthorDown(index)}>
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

    handleKeyPress = (e) => {
        if (e.key === ENTER_KEY) {
            e.preventDefault();
            if (this.state.name.trim().length > 0) {
                this.addAuthor();
            } else {
                const authorInformation = locale.sharedComponents.authors;
                const authorFields = authorInformation.fields;
                const messages = authorInformation.messages;

                this.setState({nameError: messages.authorNameMissing});

                // tried using the other ways recommended by facebook with refs but they didn't work
                document.getElementsByName(authorFields.authorName)[0].focus();
            }
        }
    };

    handleNameChange = (e) => {
        this.setState({name: e.target.value});
    };

    handleIdentifierChange = (e) => {
        this.setState({identifier: e.target.value});
    };

    moveAuthorDown = (currentIndex) => {
        if ((currentIndex + 1) < LAST_ROW) {
            this.reorderAuthor(currentIndex, currentIndex + 1);
        }
    };

    moveAuthorUp = (currentIndex) => {
        if (currentIndex > FIRST_ROW) {
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
                <div className="columns" style={{marginTop: '-20px'}}>
                    <div className="column is-addAuthor">
                        <TextField
                            name={authorFields.authorName}
                            type="text"
                            fullWidth
                            floatingLabelText={authorFields.authorNameLabel}
                            onChange={this.handleNameChange}
                            onKeyPress={this.handleKeyPress}
                            value={this.state.name}
                            errorText={this.state.nameError}
                        />
                    </div>
                    <div className="column is-narrow linkIcon">
                        <ContentLink className="iconLink"/>
                    </div>
                    <div className="column is-addUQid">
                        <TextField
                            name={authorFields.authorIdentifier}
                            fullWidth
                            floatingLabelText={authorFields.authorIdentifierLabel}
                            onChange={this.handleIdentifierChange}
                            onKeyPress={this.handleKeyPress}
                            value={this.state.identifier}
                        />
                    </div>
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
                <div className="columns">
                    <div className="column">
                        {this.state.error}
                    </div>
                </div>
                )}

                {/* List area */}
                {authorsList && authorsList.size > 0 && (
                    <div className="metadata-container">
                        <div className="columns is-gapless is-mobile headers">
                            <div className="column is-7-desktop is-7-tablet is-6-mobile header is-author">Author name</div>
                            <div className="column is-2-desktop is-2-tablet is-5-mobile header is-uqid">UQ identifier</div>
                            <div className="column is-2-desktop is-2-tablet is-0-mobile header is-reorder">&nbsp;&nbsp;&nbsp;&nbsp;Reorder</div>
                            <div className="column is-1-desktop is-1-tablet is-1-mobile header is-delete">
                                <IconButton
                                    tooltip="Remove all authors"
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

