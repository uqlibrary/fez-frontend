import React, { PureComponent } from 'react';

import { Field } from 'redux-form/lib/immutable';
import PropTypes from 'prop-types';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { CommunitiesSelectField } from 'modules/SharedComponents/PublicationSubtype';
import { CollectionsSelectField } from 'modules/SharedComponents/PublicationSubtype';
import DocumentTypeField from 'modules/SharedComponents/SearchComponent/components/Fields/DocumentTypeField';

import Grid from '@material-ui/core/Grid';

import { validation } from 'config';
import { default as componentLocale } from 'locale/components';
import { default as publicationForm } from 'locale/publicationForm';
import { Alert } from '../../SharedComponents/Toolbox/Alert';
import Button from '@material-ui/core/Button';
// import { collectionsList } from 'actions';

export const FORM_NAME = 'DigiTeamBatchImport';

export class DigiTeamBatchImport extends PureComponent {
    static propTypes = {
        submitting: PropTypes.bool,
        formValues: PropTypes.object,
        docTypes: PropTypes.array,
        isLoading: PropTypes.bool,
        actions: PropTypes.object,
        handleSubmit: PropTypes.func,
        disableSubmit: PropTypes.bool,
        loadItemsList: PropTypes.func,
    };

    static defaultProps = {
        docTypes: [],
        handleSubmit: function() {
            console.log('handleSubmit not provided'); // TODO
        },
    };

    constructor(props) {
        super(props);
        this.state = {
            rekMemberIdCommunity: null,
            rekMemberIdCollection: null,
            documentType: null,
        };
    }

    componentWillReceiveProps(nextProps) {
        console.log('componentWillReceiveProps', nextProps);
    }

    _onCommunityChange = (event, communityPid) => {
        console.log('selected community pid ', communityPid);
        if (communityPid !== this.state.rekMemberIdCommunity) {
            // community has changed - clear the collection
            this.setState({
                ...this.state,
                rekMemberIdCommunity: communityPid,
                rekMemberIdCollection: null,
            });
            console.log(this.state);

            // this.forceUpdate();
        }
    };

    _onCollectionChanged = (event, collectionPid) => {
        console.log('selected collection pid ', collectionPid);
        this.setState({
            ...this.state,
            rekMemberIdCollection: collectionPid,
        });
        console.log(this.state);
        console.log(this.state);
    };

    // _loadCollections = () => {
    //     console.log('_loadCollections');
    // };

    _onDocTypeChange = newDocType => {
        // Update the state with new values
        this.setState({
            ...this.state,
            documentType: newDocType,
        });
    };

    render() {
        const batchImportTxt = componentLocale.components.digiTeam.batchImport;
        // const publicationTypeTxt = componentLocale.publicationType;
        // const AddACollectionTxt = publicationForm.addACollection; // check this is right...

        const alertProps = validation.getErrorAlertProps({
            ...this.props,
            alertLocale: {
                validationAlert: { ...publicationForm.validationAlert },
                progressAlert: { ...publicationForm.progressAlert },
                successAlert: { ...publicationForm.successAlert },
                errorAlert: { ...publicationForm.errorAlert },
            },
        });

        return (
            <StandardPage title={batchImportTxt.title}>
                <form>
                    <Grid container spacing={16}>
                        <Grid item xs={12}>
                            <StandardCard
                                title={batchImportTxt.formLabels.label}
                                help={batchImportTxt.details.help}
                            >
                                <Grid container spacing={16}>
                                    <Grid item xs={12}>
                                        <Field
                                            component={CommunitiesSelectField}
                                            disabled={this.props.submitting}
                                            name="community_ismemberof"
                                            // locale={AddACollectionTxt.formLabels.ismemberof}
                                            locale={batchImportTxt.formLabels.community}
                                            required
                                            validate={[validation.required]}
                                            onChange={this._onCommunityChange}
                                        />
                                    </Grid>
                                    {this.props.formValues &&
                                        this.props.formValues.get('community_ismemberof') &&
                                        this.props.formValues.get('community_ismemberof').length > 0 && (
                                        <Grid item xs={12}>
                                            <Field
                                                component={CollectionsSelectField}
                                                name="collection_ismemberof"
                                                disabled={this.props.submitting}
                                                // locale={AddACollectionTxt.formLabels.ismemberof}
                                                locale={batchImportTxt.formLabels.collection}
                                                required
                                                validate={[validation.required]}
                                                onChange={this._onCollectionChanged}
                                                parentPid={this.props.formValues.get('community_ismemberof')}
                                            />
                                        </Grid>
                                    )}
                                </Grid>
                            </StandardCard>
                        </Grid>

                        <Grid item xs={12}>
                            <StandardCard
                                title={batchImportTxt.formLabels.docType.label}
                                help={batchImportTxt.details.docType.help}
                            >
                                <Grid container spacing={16}>
                                    <Grid item xs={12}>
                                        <DocumentTypeField
                                            name="doctype"
                                            docTypes={this.props.docTypes}
                                            updateDocTypeValues={this._onDocTypeChange}
                                            disabled={this.props.isLoading}
                                            disableMultiple
                                            locale={batchImportTxt.formLabels.docType}
                                            required
                                        />
                                    </Grid>
                                </Grid>
                            </StandardCard>
                        </Grid>

                        {/* <p>directory will go here</p> */}

                        {alertProps && (
                            <Grid item xs={12}>
                                <Alert {...alertProps} />
                            </Grid>
                        )}

                        <Grid item xs={false} sm />
                        <Grid item xs={12} sm="auto">
                            <Button
                                variant="contained"
                                fullWidth
                                children={batchImportTxt.formLabels.cancelButtonLabel}
                                aria-label={batchImportTxt.formLabels.cancelButtonLabel}
                                disabled={this.props.submitting}
                                onClick={this._restartWorkflow}
                            />
                        </Grid>
                        <Grid item xs={12} sm="auto">
                            <Button
                                id="submit-data-collection"
                                variant="contained"
                                color="primary"
                                fullWidth
                                children={batchImportTxt.formLabels.submitButtonLabel}
                                aria-label={batchImportTxt.formLabels.submitButtonLabel}
                                onClick={this.props.handleSubmit}
                                disabled={this.props.submitting || this.props.disableSubmit}
                            />
                        </Grid>
                    </Grid>
                </form>
            </StandardPage>
        );
    }
}

export default DigiTeamBatchImport;
