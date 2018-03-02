import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Table, TableBody, TableRow, TableRowColumn} from 'material-ui/Table';
import {StandardCard} from 'uqlibrary-react-toolbox/build/StandardCard';

export default class PublicationDetails extends Component {
    static propTypes = {
        displayType: PropTypes.string.isRequired,
        subType: PropTypes.string.isRequired,
        collections: PropTypes.array
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
        // TODO: update link href to collection view link
        return (
            <StandardCard title={'Publication details'}>
                <Table selectable={false} className="publicationDetails">
                    <TableBody displayRowCheckbox={false}>
                        {
                            this.props.displayType && this.renderRow('Publication Type', this.props.displayType)
                        }
                        {
                            this.props.subType && this.renderRow('Sub-type', this.props.subType)
                        }
                        {
                            this.props.collections && this.props.collections.length > 0 && this.renderRow('Collections', (
                                <ul className="is-paddingless is-marginless" style={{listStyleType: 'none'}}>
                                    {
                                        this.props.collections.map((collection, index)=>(
                                            collection.rek_ismemberof && collection.rek_ismemberof_lookup &&
                                            <li key={`collection-${index}`}>
                                                <a href="#">{collection.rek_ismemberof_lookup}</a>
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
