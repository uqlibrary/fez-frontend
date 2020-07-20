import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { propTypes } from 'redux-form/immutable';
import { Field } from 'redux-form/immutable';
import MenuItem from '@material-ui/core/MenuItem';
import { ConfirmDiscardFormChanges } from 'modules/SharedComponents/ConfirmDiscardFormChanges';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { NtroHeader } from 'modules/SharedComponents/Toolbox/NtroFields';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { SelectField } from 'modules/SharedComponents/Toolbox/SelectField';
import { Alert } from 'modules/SharedComponents/Toolbox/Alert';
import { FileUploadField } from 'modules/SharedComponents/Toolbox/FileUploader';
import { NavigationDialogBox } from 'modules/SharedComponents/Toolbox/NavigationPrompt';
import { publicationTypes, validation } from 'config';
import { default as txt } from 'locale/publicationForm';
import * as recordForms from './Forms';
import { DOCTYPE_SUBTYPE_MAPPING, NEW_DOCTYPES_OPTIONS, PUBLICATION_TYPE_THESIS } from 'config/general';
import Typography from '@material-ui/core/Typography';
import {
    ContentIndicatorsField,
    showContentIndicatorsField,
} from 'modules/SharedComponents/Toolbox/ContentIndicatorsField';

export default class PublicationForm extends Component {
    static propTypes = {
        ...propTypes, // all redux-form props
        hasSubtypes: PropTypes.bool,
        subtype: PropTypes.string,
        subtypes: PropTypes.array,
        formComponent: PropTypes.func,
        disableSubmit: PropTypes.bool,
        onFormSubmitSuccess: PropTypes.func.isRequired,
        onFormCancel: PropTypes.func.isRequired,
        changeDisplayType: PropTypes.func,
        changeFormType: PropTypes.func,
        isNtro: PropTypes.bool,
        isHdrStudent: PropTypes.bool,
        hasDefaultDocTypeSubType: PropTypes.bool,
        docTypeSubTypeCombo: PropTypes.object,
        isAuthorSelected: PropTypes.bool,
        initialValues: PropTypes.object,
        history: PropTypes.object,
    };

    constructor(props) {
        super(props);
        this.publicationTypes = Object.values(publicationTypes({ ...recordForms }));
        this.publicationTypeItems = [
            ...this.publicationTypes
                .filter(item => {
                    return item.isFavourite;
                })
                .map((item, index) => {
                    return (
                        <MenuItem value={item.id} key={'fav_' + index} disabled={!item.formComponent}>
                            {item.name}
                        </MenuItem>
                    );
                }),
            ...[<Divider key="div_0" />],
            ...this.publicationTypes
                .filter(item => {
                    return item.hasFormComponent;
                })
                .map((item, index) => {
                    return (
                        <MenuItem value={item.id} key={index} disabled={!item.formComponent}>
                            {item.name}
                        </MenuItem>
                    );
                }),
            ...NEW_DOCTYPES_OPTIONS.map((item, index) => (
                <MenuItem value={item} key={`ntro-${index}`}>
                    {!!DOCTYPE_SUBTYPE_MAPPING[item] ? DOCTYPE_SUBTYPE_MAPPING[item].name : item}
                </MenuItem>
            )),
        ];
    }

    // eslint-disable-next-line camelcase
    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.submitSucceeded !== this.props.submitSucceeded) {
            this.props.onFormSubmitSuccess();
        } else {
            if (!!nextProps.subtypes && nextProps.subtypes !== this.props.subtypes) {
                this.publicationSubtypeItems = nextProps.subtypes.map((item, index) => (
                    <MenuItem value={item} key={index}>
                        {item}
                    </MenuItem>
                ));
            }
            if (nextProps.hasDefaultDocTypeSubType) {
                this.props.changeDisplayType(nextProps.docTypeSubTypeCombo);
            }
            if (nextProps.isNtro !== this.props.isNtro) {
                this.props.changeFormType(nextProps.isNtro);
            }
        }
    }

    _handleDefaultSubmit = event => {
        !!event && event.preventDefault();
    };

    // whether the form should display the Add a missing work form, or offer a different function
    // (if true, display the Add a missing work form)
    _shouldDisplayAddWork = displayType => {
        const isThesis = displayType === PUBLICATION_TYPE_THESIS;
        return !(isThesis && this.props.isHdrStudent);
    };

    render() {
        const alertProps = validation.getErrorAlertProps({ ...this.props, alertLocale: txt });
        return (
            <ConfirmDiscardFormChanges dirty={this.props.dirty} submitSucceeded={this.props.submitSucceeded}>
                <form onSubmit={this._handleDefaultSubmit}>
                    <Grid container spacing={3}>
                        <NavigationDialogBox
                            when={this.props.dirty && !this.props.submitSucceeded}
                            txt={txt.cancelWorkflowConfirmation}
                        />
                        <Grid item xs={12}>
                            <StandardCard title={txt.publicationType.title} help={txt.publicationType.help}>
                                <Grid container spacing={1}>
                                    <Grid item xs={12}>
                                        <Field
                                            component={SelectField}
                                            disabled={this.props.submitting}
                                            name="rek_display_type"
                                            id="rek-display-type"
                                            value={this.props.formValues.get('rek_display_type')}
                                            label={txt.publicationType.inputLabelText}
                                            required
                                            placeholder={txt.publicationType.hintText}
                                            selectFieldId="rek-display-type"
                                        >
                                            {this.publicationTypeItems}
                                        </Field>
                                    </Grid>
                                    {(this.props.hasSubtypes || this.props.hasDefaultDocTypeSubType) && (
                                        <Grid item xs={12}>
                                            <Field
                                                component={SelectField}
                                                disabled={this.props.submitting}
                                                id="rek-subtype"
                                                name="rek_subtype"
                                                value={this.props.formValues.get('rek_subtype')}
                                                label={txt.publicationSubtype.inputLabelText}
                                                required
                                                placeholder={txt.publicationSubtype.hintText}
                                                selectFieldId="rek-subtype"
                                            >
                                                {this.publicationSubtypeItems}
                                            </Field>
                                        </Grid>
                                    )}
                                </Grid>
                            </StandardCard>
                        </Grid>
                        {!this._shouldDisplayAddWork(this.props.formValues.get('rek_display_type')) && (
                            <Grid item xs={12}>
                                {!!this.props.formComponentAlternate && (
                                    <this.props.formComponentAlternate history={this.props.history} />
                                )}
                            </Grid>
                        )}
                        {this._shouldDisplayAddWork(this.props.formValues.get('rek_display_type')) &&
                            !!this.props.formComponent && (
                                <React.Fragment>
                                    {!!this.props.isNtro && <NtroHeader />}
                                    <Grid item xs={12}>
                                        <this.props.formComponent
                                            formValues={this.props.formValues}
                                            subtype={this.props.subtype}
                                            isNtro={this.props.isNtro}
                                            isAuthorSelected={this.props.isAuthorSelected}
                                            submitting={this.props.submitting}
                                        />
                                    </Grid>
                                    {showContentIndicatorsField(
                                        this.props.formValues && this.props.formValues.toJS(),
                                    ) && (
                                        <Grid item xs={12}>
                                            <StandardCard
                                                title={txt.contentIndicators.title}
                                                help={txt.contentIndicators.help}
                                            >
                                                <Grid container spacing={3}>
                                                    <Grid item xs={12}>
                                                        <Typography>{txt.contentIndicators.description}</Typography>
                                                        <Field
                                                            component={ContentIndicatorsField}
                                                            disabled={this.props.submitting}
                                                            id="content-indicators"
                                                            name="contentIndicators"
                                                            label={txt.contentIndicators.fieldLabels.label}
                                                            multiple
                                                            fullWidth
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </StandardCard>
                                        </Grid>
                                    )}
                                    {this._shouldDisplayAddWork(this.props.formValues.get('rek_display_type')) && (
                                        <Grid item xs={12}>
                                            <StandardCard title={txt.fileUpload.title} help={txt.fileUpload.help}>
                                                <Field
                                                    name="files"
                                                    component={FileUploadField}
                                                    disabled={this.props.submitting}
                                                    requireOpenAccessStatus
                                                    validate={
                                                        this.props.isNtro
                                                            ? [
                                                                  validation.fileUploadRequired,
                                                                  validation.validFileUpload,
                                                              ]
                                                            : [validation.validFileUpload]
                                                    }
                                                    isNtro={this.props.isNtro}
                                                />
                                            </StandardCard>
                                        </Grid>
                                    )}
                                </React.Fragment>
                            )}
                        {!!this.props.formComponent && alertProps && (
                            <Grid item xs={12}>
                                <Alert pushToTop {...alertProps} />
                            </Grid>
                        )}
                    </Grid>
                    {this._shouldDisplayAddWork(this.props.formValues.get('rek_display_type')) && (
                        <Grid container spacing={3}>
                            <Grid item xs />
                            <Grid item xs={12} sm="auto">
                                <Button
                                    color="secondary"
                                    fullWidth
                                    children={txt.cancel}
                                    disabled={this.props.submitting}
                                    onClick={this.props.onFormCancel}
                                />
                            </Grid>
                            {((this.props.formValues.get('rek_display_type') > 0 && !this.props.hasSubtypes) ||
                                (this.props.hasSubtypes &&
                                    this.props.formValues.get('rek_subtype') &&
                                    this.props.formValues.get('rek_subtype').length > 0)) && (
                                <Grid item xs={12} sm="auto">
                                    <Button
                                        style={{ whiteSpace: 'nowrap' }}
                                        id="submit-work"
                                        variant="contained"
                                        color="primary"
                                        fullWidth
                                        children={txt.submit}
                                        onClick={this.props.handleSubmit}
                                        disabled={this.props.submitting || this.props.disableSubmit}
                                    />
                                </Grid>
                            )}
                        </Grid>
                    )}
                </form>
            </ConfirmDiscardFormChanges>
        );
    }
}
