import React, {Component} from 'react';
import PropTypes from 'prop-types';
import locale from 'locale/viewRecord';
import {pathConfig} from 'config/routes';
import {Table, TableBody, TableRow, TableRowColumn} from 'material-ui/Table';
import {StandardCard} from 'uqlibrary-react-toolbox/build/StandardCard';

export default class PublicationDetails extends Component {
    static propTypes = {
        publication: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
    }

    renderRow = (heading, data) => {
        return (
            <TableRow className="tableRow">
                <TableRowColumn className="headingColumn">
                    {heading}
                </TableRowColumn>
                <TableRowColumn className="dataColumn">
                    {data}
                </TableRowColumn>
            </TableRow>
        );
    }

    render() {
        return (
            <StandardCard title={'Publication details'}>
                <Table selectable={false} className="publicationDetails">
                    <TableBody displayRowCheckbox={false}>
                        {
                            this.props.publication.rek_display_type_lookup &&
                            this.renderRow(locale.viewRecord.publicationDetails.rek_display_type, this.props.publication.rek_display_type_lookup)
                        }
                        {
                            this.props.publication.rek_subtype &&
                            this.renderRow(locale.viewRecord.publicationDetails.rek_subtype, this.props.publication.rek_subtype)
                        }
                        {
                            this.props.publication.fez_record_search_key_ismemberof && this.props.publication.fez_record_search_key_ismemberof.length > 0 &&
                            this.renderRow(locale.viewRecord.publicationDetails.fez_record_search_key_ismemberof, (
                                <ul className="is-paddingless is-marginless" style={{listStyleType: 'none'}}>
                                    {
                                        this.props.publication.fez_record_search_key_ismemberof.map((collection, index)=>(
                                            collection.rek_ismemberof && collection.rek_ismemberof_lookup &&
                                            <li key={`collection-${index}`}>
                                                <a href={pathConfig.collection.view(this.props.publication.rek_pid)}>{collection.rek_ismemberof_lookup}</a>
                                            </li>
                                        ))
                                    }
                                </ul>
                            ))
                        }
                    </TableBody>
                </Table>
            </StandardCard>
        );
    }
}
