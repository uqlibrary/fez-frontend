import React, {Component} from 'react';
import TextField from 'material-ui/TextField';
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

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                {/* Input area */}
                <div className="columns">
                    <div className="column">
                        <TextField
                            fullWidth
                            floatingLabelText="Add an author (name as published)"
                            hintText="Add author's name as published"
                        />
                    </div>
                    <div className="column is-narrow">
                        <ContentLink style={iconStyles}/>
                    </div>
                    <div className="column">
                        <TextField
                            fullWidth
                            floatingLabelText="UQ identifier"
                        />
                    </div>
                    <div className="column is-narrow">
                        <RaisedButton label="ADD AUTHORgit ad" primary style={buttonStyles}/>
                    </div>
                </div>

                {/* List area */}
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
                                <TableRow displayRowCheckbox={false}>
                                    <TableRowColumn>John Smith</TableRowColumn>
                                    <TableRowColumn>uqjsmith1</TableRowColumn>
                                    <TableRowColumn style={actionRowStyle}>
                                        <IconButton tooltip="Move record up the order" iconStyle={listStyle} hoveredStyle={hoveredListstyle}><KeyboardUp /></IconButton>
                                        <IconButton tooltip="Move record down the order" iconStyle={listStyle} hoveredStyle={hoveredListstyle}><KeyboardDown /></IconButton>
                                    </TableRowColumn>
                                    <TableRowColumn style={actionRowStyle}><IconButton tooltip="Remove this author" iconStyle={listStyle} hoveredStyle={hoveredListstyle}><ActionDelete /></IconButton></TableRowColumn>
                                </TableRow>

                                <TableRow displayRowCheckbox={false}>
                                    <TableRowColumn>Jane Smith</TableRowColumn>
                                    <TableRowColumn>uqjsmith2</TableRowColumn>
                                    <TableRowColumn style={actionRowStyle}>
                                        <IconButton tooltip="Move record up the order" iconStyle={listStyle} hoveredStyle={hoveredListstyle}><KeyboardUp /></IconButton>
                                        <IconButton tooltip="Move record down the order" iconStyle={listStyle} hoveredStyle={hoveredListstyle}><KeyboardDown /></IconButton>
                                    </TableRowColumn>
                                    <TableRowColumn style={actionRowStyle}><IconButton tooltip="Remove this author" iconStyle={listStyle} hoveredStyle={hoveredListstyle}><ActionDelete /></IconButton></TableRowColumn>
                                </TableRow>

                                <TableRow displayRowCheckbox={false}>
                                    <TableRowColumn>Jeff Smith</TableRowColumn>
                                    <TableRowColumn>uqjsmith3</TableRowColumn>
                                    <TableRowColumn style={actionRowStyle}>
                                        <IconButton tooltip="Move record up the order" iconStyle={listStyle} hoveredStyle={hoveredListstyle}><KeyboardUp /></IconButton>
                                        <IconButton tooltip="Move record down the order" iconStyle={listStyle} hoveredStyle={hoveredListstyle}><KeyboardDown /></IconButton>
                                    </TableRowColumn>
                                    <TableRowColumn style={actionRowStyle}><IconButton tooltip="Remove this author" iconStyle={listStyle} hoveredStyle={hoveredListstyle}><ActionDelete /></IconButton></TableRowColumn>
                                </TableRow>

                                <TableRow />
                            </TableBody>
                        </Table>


                    </div>
                </div>

            </div>

        );
    }
}

