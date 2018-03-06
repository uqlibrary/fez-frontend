import React, {Component} from 'react';
import PropTypes from 'prop-types';
import locale from 'locale/viewRecord';
import {Table, TableBody, TableRow, TableRowColumn} from 'material-ui/Table';
import {StandardCard} from 'uqlibrary-react-toolbox/build/StandardCard';
import {AuthorsCitationView, DoiCitationView, EditorsCitationView} from '../../SharedComponents/PublicationCitation/components/citations/partials';

const moment = require('moment');

export default class AdditionalInformation extends Component {
    static propTypes = {
        publication: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
    }

    renderRow = (heading, data) => {
        return (
            <TableRow key={heading} className="tableRow">
                <TableRowColumn className="headingColumn">
                    {heading}
                </TableRowColumn>
                <TableRowColumn className="dataColumn">
                    {data}
                </TableRowColumn>
            </TableRow>
        );
    }

    getTitle = (publication) => {
        return publication.rek_formatted_title ? publication.rek_formatted_title : publication.rek_title;
    }

    renderContributors = (publication) => {
        return (
            <EditorsCitationView publication={publication}/>
        );
    }

    renderAuthors = (publication) => {
        return (
            <AuthorsCitationView publication={publication}/>
        );
    }

    renderDoi = (doi) => {
        return (
            <DoiCitationView doi={doi}/>
        );
    }

    renderList = (list, column) => {
        return (
            <ul>
                {
                    list.map((item, index)=>(
                        <li key={index}>
                            {item[column]}
                        </li>
                    ))
                }
            </ul>
        );
    }

    renderColumns = () => {
        const rows = [];
        const columnPrefix = 'fez_record_search_key_';
        const valuePrefix = 'rek_';
        const lookupSuffix = '_lookup';

        // element might have null values
        Object.keys(this.props.publication).forEach((key) => {
            const data = [];
            let value = this.props.publication[key];
            if (value && Object.keys(value).length > 0 && locale.viewRecord.fields.default[key]) {
                // console.log('printing key: ' + key);
                // console.log('if value is an array:' + Array.isArray(value));
                // console.log('printing value type: ' + typeof value);
                // console.log(value);
                const column = key.indexOf(columnPrefix) === 0 ? valuePrefix + key.substring(columnPrefix.length) : null;
                const heading = locale.viewRecord.fields[this.props.publication.rek_display_type_lookup] ? locale.viewRecord.fields[this.props.publication.rek_display_type_lookup][key] : locale.viewRecord.fields.default[key];

                console.log('print heading: ' + column);

                // logic to get values from fez_record_search_key fields
                if (column) {
                    if (Array.isArray(value)) {
                        if (column === 'rek_author') {
                            value = this.renderAuthors(this.props.publication);
                        } else if (column === 'rek_contributor') {
                            // check for authors, contributors and supervisors
                            value = this.renderContributors(this.props.publication);
                        } else {
                            value = this.renderList(value, column);
                        }
                        data.push(value);
                    } else {
                        if (column === 'rek_doi') {
                            value = this.renderDoi(value[column]);
                        } else {
                            value = value[column + lookupSuffix] ?  value[column + lookupSuffix] : value[column];
                        }
                        // single object
                        data.push(value);
                        // console.log(value[column]);
                    }
                } else {
                    // get values for rek_ fields e.g. rek_title
                    if (key === 'rek_title') {
                        value = this.getTitle(this.props.publication);
                    } else if (key === 'rek_date_available') {
                        value =  moment(value).format('YYYY');
                    }
                    data.push(value);
                }

                // if key = authors, doi, editors, contributors => call partial components
                rows.push(this.renderRow(heading, data));
            }
        });

        return rows;
    }

    render() {
        return (
            <StandardCard title={locale.viewRecord.sections.additionalInformation}>
                <Table selectable={false}>
                    <TableBody displayRowCheckbox={false}>
                        {
                            this.renderColumns()
                        }
                    </TableBody>
                </Table>
            </StandardCard>
        );
    }
}
