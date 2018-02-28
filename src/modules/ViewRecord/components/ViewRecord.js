import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {InlineLoader} from 'uqlibrary-react-toolbox/build/Loaders';
import {StandardPage} from 'uqlibrary-react-toolbox/build/StandardPage';
import {StandardCard} from 'uqlibrary-react-toolbox/build/StandardCard';
import {Alert} from 'uqlibrary-react-toolbox/build/Alert';
import {PublicationCitation} from 'modules/SharedComponents/PublicationCitation';
import {PubmedCentralLink} from 'modules/SharedComponents/PubmedCentralLink';

import {locale} from 'locale';
import {Table, TableBody, TableRow, TableRowColumn} from 'material-ui/Table';

export default class ViewRecord extends Component {
    static propTypes = {
        recordToView: PropTypes.object,
        loadingRecordToView: PropTypes.bool,
        recordToViewError: PropTypes.string,
        match: PropTypes.object.isRequired,
        actions: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        if (this.props.actions && !this.props.recordToView) {
            this.props.actions.loadRecordToView(this.props.match.params.pid);
        }
    }

    componentWillUnmount() {
        // clear previously selected record
        if (this.props.actions) {
            this.props.actions.clearRecordToView();
        }
    }

    renderPublicationDetails = () => {
        const rowStyle = {height: '0'};
        const headingColumnStyle = {padding: '0.5em 0px 0.5em 0.5em', width: '95px', height: '0', verticalAlign: 'top'};
        const dataColumnStyle = {padding: '0.5em 0px 0.5em 0.5em', height: '0'};

        return (
            <Table selectable={false}>
                <TableBody displayRowCheckbox={false}>
                    <TableRow style={rowStyle}>
                        <TableRowColumn style={headingColumnStyle}>
                            Publication Type
                        </TableRowColumn>
                        <TableRowColumn style={dataColumnStyle}>
                            <b>{this.props.recordToView.rek_display_type_lookup}</b>
                        </TableRowColumn>
                    </TableRow>
                    <TableRow style={rowStyle}>
                        <TableRowColumn style={headingColumnStyle}>
                            Sub-type
                        </TableRowColumn>
                        <TableRowColumn style={dataColumnStyle}>
                            <b>{this.props.recordToView.rek_subtype}</b>
                        </TableRowColumn>
                    </TableRow>
                    <TableRow style={rowStyle}>
                        <TableRowColumn style={headingColumnStyle}>
                            Collections
                        </TableRowColumn>
                        <TableRowColumn style={dataColumnStyle}>
                            <ul className={'is-paddingless is-marginless'} style={{listStyleType: 'none'}}>
                                {
                                    this.props.recordToView.fez_record_search_key_ismemberof.map((collection, index)=>(
                                        <li key={`collection-${index}`}>
                                            <b><a href={`#/records/${collection.rek_ismemberof}`}>{collection.rek_ismemberof_lookup}</a></b>
                                        </li>
                                    ))
                                }
                            </ul>
                        </TableRowColumn>
                    </TableRow>
                </TableBody>
            </Table>
        );
    }

    render() {
        const txt = locale.pages.viewRecord;

        if(this.props.loadingRecordToView) {
            return (
                <div className="is-centered">
                    <InlineLoader message={txt.loadingMessage}/>
                </div>
            );
        }

        if(this.props.recordToViewError) {
            return (
                <StandardPage>
                    <Alert message={this.props.recordToViewError} />
                </StandardPage>
            );
        }

        return (
            <StandardPage>
                <PublicationCitation publication={this.props.recordToView}/>
                <StandardCard title={'Links'}>
                    Include PubmedCentral link if available: <PubmedCentralLink pubmedCentralId={'PMC123232'} />
                </StandardCard>
                <StandardCard title={'Files'} />
                <StandardCard title={'Additional information'} />
                <StandardCard title={'Publication details'}>
                    {
                        this.renderPublicationDetails()
                    }
                </StandardCard>
            </StandardPage>
        );
    }
}
