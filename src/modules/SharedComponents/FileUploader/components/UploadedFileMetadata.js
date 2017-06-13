import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {Toolbar, ToolbarGroup} from 'material-ui/Toolbar';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';

import {getIcon} from './fileHelper';
import {locale} from 'config';
import './UploadedFileMetadata.scss';

export default class UploadedFileMetadata extends PureComponent {

    static propTypes = {
        form: PropTypes.string.isRequired,
        dataSource: PropTypes.object.isRequired,
        deleteFile: PropTypes.func,
        documentAccessTypes: PropTypes.object
    };

    constructor(props) {
        super(props);
    }

    deleteFile = (file) => {
        // remove file from state
        this.props.deleteFile(file);
    };

    formatMetadataDetails = (dataSource, fileMetadataFields) => {
        let accessDetails;
        if (dataSource[fileMetadataFields.accessCondition]) {
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

    getFileOptions = (filename) => (
        <FlatButton label={locale.sharedComponents.files.buttons.deleteLabel} onTouchTap={() => this.deleteFile(filename)} />
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
                    {this.getFileOptions(dataSource.file.name)}
                </ToolbarGroup>
            </Toolbar>
        );
    }
}
