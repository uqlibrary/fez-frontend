import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {Toolbar, ToolbarGroup} from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import FontIcon from 'material-ui/FontIcon';

import {getIcon} from './fileHelper';
import {locale} from 'config';
import './UploadedFileMetadata.scss';
import {EMBARGO_ID} from './fileHelper';

export default class UploadedFileMetadata extends PureComponent {

    static propTypes = {
        form: PropTypes.string.isRequired,
        dataSource: PropTypes.object.isRequired,
        documentAccessTypes: PropTypes.object
    };

    constructor(props) {
        super(props);
    }

    formatMetadataDetails = (dataSource, fileMetadataFields) => {
        let accessDetails;
        if (dataSource[fileMetadataFields.accessCondition] === EMBARGO_ID) {
            const d = dataSource[fileMetadataFields.embargoDate] ? new Date(dataSource[fileMetadataFields.embargoDate]) : new Date();
            accessDetails = ` - embargoed until ${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
        } else {
            if (dataSource[fileMetadataFields.accessCondition]) {
                const selectedDoc = this.props.documentAccessTypes.find(doc => {
                    return doc.get('id') === dataSource[fileMetadataFields.accessCondition];
                });

                accessDetails = ` - ${selectedDoc.get('title')}`;
            } else {
                accessDetails = '';
            }
        }

        return `${dataSource[fileMetadataFields.description]}${accessDetails}`;
    };

    getFileOptions = () => (
        <IconMenu
            iconButtonElement={
                <IconButton><MoreVertIcon /></IconButton>
            }
            targetOrigin={{horizontal: 'right', vertical: 'top'}}
            anchorOrigin={{horizontal: 'right', vertical: 'top'}}
        >
            <MenuItem primaryText="Download" />
            <MenuItem primaryText="Re-upload" />
            <MenuItem primaryText="Remove" />
        </IconMenu>
    );

    render() {
        const {
            dataSource
        } = this.props;

        const fileMetadataFields = locale.sharedComponents.files.fields.metadata;

        return (
            <Toolbar className="metadataRow">
                <ToolbarGroup firstChild className="iconCell">
                    <FontIcon
                        className="material-icons">{getIcon(dataSource.file.type)}</FontIcon>
                </ToolbarGroup>
                <ToolbarGroup className="metadataDetails">
                    <div>{dataSource.file.name}</div>
                    <div className="secondaryDetails">{this.formatMetadataDetails(dataSource, fileMetadataFields)}</div>
                </ToolbarGroup>
                <ToolbarGroup>
                    {this.getFileOptions()}
                </ToolbarGroup>
            </Toolbar>
        );
    }
}
