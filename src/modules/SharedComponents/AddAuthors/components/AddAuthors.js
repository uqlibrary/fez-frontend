import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {TextField} from 'uqlibrary-react-toolbox';
import ContentLink from 'material-ui/svg-icons/content/link';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import ActionDeleteAll from 'material-ui/svg-icons/action/delete-forever';
import FlatButton from 'material-ui/FlatButton';
import KeyboardUp from 'material-ui/svg-icons/hardware/keyboard-arrow-up';
import KeyboardDown from 'material-ui/svg-icons/hardware/keyboard-arrow-down';
import RaisedButton from 'material-ui/RaisedButton';
import IconButton from 'material-ui/IconButton';
import Dialog from 'material-ui/Dialog';

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
            name: '',
            identifier: ''
        };

        this.addAuthor = this.addAuthor.bind(this);
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
                error: ''
            });

            // update the the authors reducer
            this.props.updateAuthorsList(authorsList);
        } else {
            this.setState({
                name: '',
                identifier: '',
                error: messages.authorExists
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
                    <TableRow key={key}>
                        <TableRowColumn>
                            {author.get('name')}
                            {index === FIRST_ROW && (
                                <div className="priority-author">
                                    {authorOrderText}
                                </div>
                            )}
                        </TableRowColumn>
                        <TableRowColumn>{author.get('identifier')}</TableRowColumn>
                        <TableRowColumn style={actionRowStyle}>
                            <IconButton tooltip={authorRowInfo.moveRecordUp} disabled={index === FIRST_ROW} iconStyle={listStyle} hoveredStyle={hoveredListstyle} onClick={() => this.moveAuthorUp(index)}>
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

    handleKeyPress = (e) => {
        if (e.key === ENTER_KEY) {
            e.preventDefault();
            if (this.state.name.trim().length > 0) {
                this.addAuthor();
            } else {
                const authorInformation = locale.sharedComponents.authors;
                const authorFields = authorInformation.fields;
                const messages = authorInformation.messages;

                this.setState({error: messages.authorNameMissing});

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
                <div className="columns">
                    <div className="column">
                        <TextField
                            name={authorFields.authorName}
                            type="text"
                            fullWidth
                            floatingLabelText={authorFields.authorNameLabel}
                            onChange={this.handleNameChange}
                            onKeyPress={this.handleKeyPress}
                            value={this.state.name}
                        />
                    </div>
                    <div className="column is-narrow">
                        <ContentLink style={iconStyles}/>
                    </div>
                    <div className="column">
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

