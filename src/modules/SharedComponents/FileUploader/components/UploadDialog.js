import React, {PureComponent} from 'react';
import Dialog from 'material-ui/Dialog';
import PropTypes from 'prop-types';
import Immutable from 'immutable';

// custom components
import FileStepper from '../containers/FileStepper';
import {locale} from 'config';

export default class UploadDialog extends PureComponent {

    static propTypes = {
        acceptedFiles: PropTypes.array.isRequired,
        form: PropTypes.string.isRequired,
        isDialogOpen: PropTypes.bool,
        page: PropTypes.string
    };

    static defaultProps = {
        isOpen: Immutable.fromJS(false),
        uploadError: ''
    };

    constructor(props) {
        super(props);

        this.state = {
            fileSummary: [],
            uploadProgress: []
        };
    }

    render() {
        const {
            acceptedFiles,
            isDialogOpen,
            form,
        } = this.props;
        const fileInformation = locale.sharedComponents.files;

        return (
            <Dialog
                title={fileInformation.dialog.title}
                modal={false}
                open={isDialogOpen}
                className="uploadFileDialog"
                actionsContainerClassName="actionsPanel"
                bodyClassName="stepperContentPanel"
            >
                <FileStepper
                    form={form}
                    acceptedFiles={acceptedFiles}
                />
            </Dialog>
        );
    }
}
