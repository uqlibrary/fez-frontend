import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import locale from 'locale/viewRecord';
import {pathConfig} from 'config/routes';
import {Table, TableBody} from 'material-ui/Table';
import {StandardCard} from 'modules/SharedComponents/Toolbox/StandardCard';
import ViewRecordTableRow from './ViewRecordTableRow';

export default class PublicationDetails extends PureComponent {
    static propTypes = {
        publication: PropTypes.object.isRequired
    };

    render() {
        if (!this.props.publication.rek_display_type_lookup) {
            return null;
        }

        return (
            <StandardCard title={locale.viewRecord.sections.publicationDetails}>
                <Table selectable={false} className="publicationDetails vertical">
                    <TableBody displayRowCheckbox={false}>
                        {
                            this.props.publication.rek_display_type_lookup &&
                            <ViewRecordTableRow heading={locale.viewRecord.headings.default.publicationDetails.rek_display_type} data={this.props.publication.rek_display_type_lookup} />
                        }
                        {
                            this.props.publication.rek_subtype &&
                            <ViewRecordTableRow heading={locale.viewRecord.headings.default.publicationDetails.rek_subtype} data={this.props.publication.rek_subtype} />
                        }
                        {
                            this.props.publication.fez_record_search_key_ismemberof && this.props.publication.fez_record_search_key_ismemberof.length > 0 &&
                            <ViewRecordTableRow heading={locale.viewRecord.headings.default.publicationDetails.fez_record_search_key_ismemberof} data={(
                                <ul>
                                    {
                                        this.props.publication.fez_record_search_key_ismemberof.map((collection, index)=>(
                                            collection.rek_ismemberof && collection.rek_ismemberof_lookup &&
                                            <li key={`collection-${index}`}>
                                                <a href={pathConfig.collection.view(collection.rek_ismemberof)}>{collection.rek_ismemberof_lookup}</a>
                                            </li>
                                        ))
                                    }
                                </ul>
                            )} />
                        }
                    </TableBody>
                </Table>
            </StandardCard>
        );
    }
}
