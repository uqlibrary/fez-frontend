import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { propTypes } from 'redux-form/immutable';
import { Field } from 'redux-form/immutable';
import { Alert } from 'modules/SharedComponents/Toolbox/Alert';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { publicationTypes, validation } from 'config';
import { default as locale } from 'locale/pages';
import { default as formLocale } from 'locale/publicationForm';
import { CollectionField } from 'modules/SharedComponents/LookupFields';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { pathConfig } from 'config/routes';
import * as recordForms from 'modules/SharedComponents/PublicationForm/components/Forms';
import { NEW_DOCTYPES_OPTIONS, DOCTYPE_SUBTYPE_MAPPING } from 'config/general';
import { SelectField } from 'modules/SharedComponents/Toolbox/SelectField';

import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';

export default class CollectionForm extends Component {
    static propTypes = {
        ...propTypes, // all redux-form props
        author: PropTypes.object,
        account: PropTypes.bool,
        disableSubmit: PropTypes.bool,
        fileAccessId: PropTypes.number,
        actions: PropTypes.object,
        isSessionValid: PropTypes.bool,
        formValues: PropTypes.object,
        formErrors: PropTypes.object,
        hasSubtypes: PropTypes.bool,
        subtypes: PropTypes.array,
        newCollectionSaving: PropTypes.bool,
        newCollectionError: PropTypes.bool,
        newRecord: PropTypes.object,
    };

    static contextTypes = {
        selectFieldMobileOverrides: PropTypes.object,
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

    componentWillReceiveProps(nextProps) {
        if (nextProps.submitSucceeded !== this.props.submitSucceeded) {
            this.onSubmit;
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

    cancelSubmit = () => {
        window.location.assign(pathConfig.index);
    };

    onSubmit = () => {
        window.location.assign(pathConfig.admin.edit('UQ:123456'));
    };

    render() {
        const txt = locale.pages.adminAdd;
        const alertProps = validation.getErrorAlertProps({
            ...this.props,
            alertLocale: {
                validationAlert: { ...formLocale.validationAlert },
                progressAlert: { ...formLocale.progressAlert },
                successAlert: { ...formLocale.successAlert },
                errorAlert: {
                    ...formLocale.errorAlert,
                    message: txt.submitFailed,
                },
            },
        });
        return (
            <StandardPage title={txt.title}>
                <form>
                    <Grid container spacing={24}>
                        <Grid item xs={12}>
                            <StandardCard title={txt.step1} help={txt.help}>
                                <Grid container spacing={24}>
                                    <Grid item xs={12}>
                                        <Field
                                            component={CollectionField}
                                            disabled={this.props.submitting}
                                            name="fez_record_search_key_ismemberof"
                                            id="fez_record_search_key_ismemberof"
                                            floatingLabelText={txt.formLabels.ismemberof.floatingLabelText}
                                            hintText={txt.formLabels.ismemberof.hintText}
                                            fullwidth
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Field
                                            component={SelectField}
                                            disabled={this.props.submitting}
                                            name="rek_display_type"
                                            id="rek-display-type"
                                            value={this.props.formValues.get('rek_display_type')}
                                            label={txt.formLabels.rek_display_type.inputLabelText}
                                            required
                                            validate={[validation.required]}
                                            placeholder={txt.formLabels.rek_display_type.hintText}
                                            SelectDisplayProps={{
                                                id: 'rek-display-type',
                                            }}
                                        >
                                            {this.publicationTypeItems}
                                        </Field>
                                    </Grid>
                                    <Grid item xs={12}>
                                        {(this.props.hasSubtypes || this.props.hasDefaultDocTypeSubType) && (
                                            <Grid item xs={12}>
                                                <Field
                                                    component={SelectField}
                                                    disabled={this.props.submitting}
                                                    id="rek-subtype"
                                                    name="rek_subtype"
                                                    value={this.props.formValues.get('rek_subtype')}
                                                    label={txt.formLabels.rek_subtype.inputLabelText}
                                                    required
                                                    validate={[validation.required]}
                                                    placeholder={txt.formLabels.rek_subtype.hintText}
                                                    SelectDisplayProps={{
                                                        id: 'rek-subtype',
                                                    }}
                                                >
                                                    {this.publicationSubtypeItems}
                                                </Field>
                                            </Grid>
                                        )}
                                    </Grid>
                                </Grid>
                            </StandardCard>
                        </Grid>
                        {alertProps && (
                            <Grid item xs={12}>
                                <Alert {...alertProps} />
                            </Grid>
                        )}
                    </Grid>
                    <Grid container spacing={16}>
                        <Grid item xs={false} sm />
                        <Grid item xs={12} sm={'auto'}>
                            <Button
                                variant={'contained'}
                                fullWidth
                                disabled={this.props.submitting}
                                onClick={this.cancelSubmit}
                            >
                                {txt.formLabels.cancel}
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={'auto'}>
                            <Button
                                variant={'contained'}
                                color={'primary'}
                                fullWidth
                                onClick={this.onSubmit}
                                disabled={this.props.submitting || this.props.disableSubmit}
                            >
                                {txt.formLabels.submit}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </StandardPage>
        );
    }
}
