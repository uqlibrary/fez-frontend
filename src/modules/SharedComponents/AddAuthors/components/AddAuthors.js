import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {TextField} from 'uqlibrary-react-toolbox';
import ContentLink from 'material-ui/svg-icons/content/link';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import ActionDeleteAll from 'material-ui/svg-icons/action/delete-forever';
import KeyboardUp from 'material-ui/svg-icons/hardware/keyboard-arrow-up';
import KeyboardDown from 'material-ui/svg-icons/hardware/keyboard-arrow-down';
import RaisedButton from 'material-ui/RaisedButton';
import IconButton from 'material-ui/IconButton';
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

export default class AddAuthors extends Component {

    static propTypes = {
        formValues: PropTypes.object
    };

    constructor(props) {
        super(props);

        this.state = {
            name: '',
            identifier: '',
            authorsList: []
        };
    }

    addAuthor = () => {
        const authorsList = this.state.authorsList;

        let found = false;
        if (this.state.identifier.length > 0) {
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
                authorsList
            });
        }
    };

    buildAuthorRow = () => {
        const authorInformation = locale.pages.addRecord.addJournalArticle.authors;
        const authorRowInfo = authorInformation.rows;

        // removed from tablerow cos it's throwing errors displayRowCheckbox={false}
        return (
             this.state.authorsList.map((author, index) => {
                 const key = `${author}${index}`;
                 return (
                    <TableRow key={key}>
                        <TableRowColumn>{author.name}</TableRowColumn>
                        <TableRowColumn>{author.identifier}</TableRowColumn>
                        <TableRowColumn style={actionRowStyle}>
                            <IconButton tooltip={authorRowInfo.moveRecordUp} iconStyle={listStyle} hoveredStyle={hoveredListstyle}><KeyboardUp /></IconButton>
                            <IconButton tooltip={authorRowInfo.moveRecordDown}  iconStyle={listStyle} hoveredStyle={hoveredListstyle}><KeyboardDown /></IconButton>
                        </TableRowColumn>
                        <TableRowColumn style={actionRowStyle}><IconButton tooltip={authorRowInfo.removeRecord} iconStyle={listStyle} hoveredStyle={hoveredListstyle}><ActionDelete /></IconButton></TableRowColumn>
                    </TableRow>
                 );
             })
        );
    };

    handleNameChange = (e) => {
        this.setState({name: e.target.value});
    };

    handleIdentifierChange = (e) => {
        this.setState({identifier: e.target.value});
    };

    render() {
        const authorInformation = locale.pages.addRecord.addJournalArticle.authors;
        const authorFields = authorInformation.fields;

        return (
            <div>
                {/* Input area */}
                <div className="columns">
                    <div className="column">
                        <TextField
                            name={authorFields.authorName}
                            type="text"
                            fullWidth
                            floatingLabelText={authorFields.authorNameLabel}
                            hintText={authorFields.authorNameHintText}
                            onChange={this.handleNameChange}
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
                            value={this.state.identifier}
                        />
                    </div>
                    <div className="column is-narrow">
                        <RaisedButton
                            label="ADD AUTHOR"
                            primary
                            style={buttonStyles}
                            onClick={this.addAuthor} />
                    </div>
                </div>

                {/* List area */}
                {this.state.authorsList.length > 0 && (
                <div className="columns">
                    <div className="column">
                        <Table selectable={false} >
                            <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                                <TableRow>
                                    <TableHeaderColumn>Name</TableHeaderColumn>
                                    <TableHeaderColumn>UQ identifier</TableHeaderColumn>
                                    <TableHeaderColumn style={actionRowStyle}>Reorder</TableHeaderColumn>
                                    <TableHeaderColumn style={actionRowStyle}>
                                        <IconButton tooltip="Remove all authors" iconStyle={listStyle} hoveredStyle={hoveredListstyle}><ActionDeleteAll /></IconButton>
                                    </TableHeaderColumn>
                                </TableRow>
                            </TableHeader>
                            <TableBody displayRowCheckbox={false}>
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

