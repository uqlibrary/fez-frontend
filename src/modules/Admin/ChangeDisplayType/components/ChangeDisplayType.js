import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import ReactHtmlParser from 'react-html-parser';
import { useParams } from 'react-router';
import { Field } from 'redux-form/immutable';
import { useConfirmationState } from 'hooks';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';

import viewRecordLocale from 'locale/viewRecord';
import { DOCUMENT_TYPES_EDIT_ONLY, publicationTypes } from 'config/general';
import { routes, validation } from 'config';
import { default as componentsLocale } from 'locale/components';
import { default as pagesLocale } from 'locale/pages';

import { Alert } from 'modules/SharedComponents/Toolbox/Alert';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import { PublicationCitation } from 'modules/SharedComponents/PublicationCitation';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { SelectField } from 'modules/SharedComponents/Toolbox/SelectField';
import { ConfirmationBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';

const txt = {
    ...componentsLocale.components.changeDisplayType,
    headings: viewRecordLocale.viewRecord.headings,
    alertProps: pagesLocale.pages.edit.alerts,
};

const renderTitle = record => {
    const prefixTxt = componentsLocale.components.changeDisplayType.title;
    const subtypeSuffix = !!record.rek_subtype ? ` - ${record.rek_subtype}` : '';
    const pageTitle = ReactHtmlParser(`${prefixTxt} ${record.rek_display_type_lookup}${subtypeSuffix}`);
    return (
        <Typography variant="h2" color="primary" style={{ fontSize: 24 }} data-testid="changeDisplayType-page-title">
            {pageTitle}
        </Typography>
    );
};

const _handleDefaultSubmit = event => {
    !!event && event.preventDefault();
};

export const ChangeDisplayType = ({
    disableSubmit,
    formValues,
    handleSubmit,
    history,
    loadingRecordToView,
    loadRecordToView,
    publicationSubtype,
    publicationSubtypeItems,
    record,
    resetSubType,
    saveRequesting,
    saveUpdated,
    saveFailed,
    selectedPublicationType,
    submitting,
}) => {
    const { pid: pidParam } = useParams();
    useEffect(() => {
        // Load record if it hasn't
        !!pidParam && (!record || record.rek_pid !== pidParam) && !!loadRecordToView && loadRecordToView(pidParam);
        return () => {
            resetSubType();
        };
    }, [loadRecordToView, pidParam, record, resetSubType]);

    const [isOpen, showConfirmation, hideConfirmation] = useConfirmationState();
    /* istanbul ignore next */
    React.useEffect(() => {
        if (saveUpdated) {
            showConfirmation();
        }
    }, [showConfirmation, saveUpdated]);

    const alertProps = validation.getErrorAlertProps({
        alertLocale: txt.alertProps,
        error: saveFailed,
        submitSucceeded: saveUpdated,
        submitting: saveRequesting,
    });

    if (!!pidParam && loadingRecordToView) {
        return <InlineLoader message={txt.loadingMessage} />;
    }

    // Record not found
    const pid = !!record && record.rek_pid;
    if (!!pidParam && !pid) {
        return <div className="ChangeDisplayType empty" />;
    }

    const allPublicationTypes = Object.values(publicationTypes());
    const availablePublicationTypes = allPublicationTypes.filter(
        pubType => !DOCUMENT_TYPES_EDIT_ONLY.includes(pubType.id),
    );
    const publicationTypeItems = [
        ...availablePublicationTypes.map((item, index) => {
            return (
                <MenuItem value={item.id} key={index}>
                    {item.name}
                </MenuItem>
            );
        }),
    ];

    const subitems =
        !!publicationSubtypeItems && publicationSubtypeItems.length > 0
            ? [
                  ...publicationSubtypeItems.map((item, index) => (
                      <MenuItem value={item} key={index}>
                          {item}
                      </MenuItem>
                  )),
              ]
            : [];

    const navigateToViewPage = pid => {
        if (!!pid && validation.isValidPid(pid)) {
            history.push(routes.pathConfig.records.view(pid));
        }
    };

    const navigateToEditRecord = pid => {
        if (!!pid && validation.isValidPid(pid)) {
            history.push(routes.pathConfig.admin.edit(pid));
        }
    };

    const clearSubitems = () => {
        resetSubType();
    };

    return (
        <form onSubmit={_handleDefaultSubmit}>
            <StandardPage>
                {!!pid && (
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            {renderTitle(record)}
                            <PublicationCitation
                                publication={record}
                                hideTitle
                                hideCitationCounts
                                hideContentIndicators
                            />
                        </Grid>
                        <ConfirmationBox
                            confirmationBoxId="changeDisplayTypeDone"
                            isOpen={isOpen}
                            onAction={() => navigateToEditRecord(record.rek_pid)}
                            locale={txt.workflowConfirmation}
                            onCancelAction={() => navigateToViewPage(record.rek_pid)}
                            onClose={hideConfirmation}
                        />
                        <Grid item xs={12}>
                            <StandardCard title={txt.publicationType.title} help={txt.publicationType.help}>
                                <Grid container spacing={1}>
                                    <Grid item xs={12}>
                                        <Field
                                            component={SelectField}
                                            disabled={submitting}
                                            name="rek_display_type"
                                            id="rek-display-type"
                                            value={selectedPublicationType}
                                            label={txt.publicationType.inputLabelText}
                                            required
                                            placeholder={txt.publicationType.hintText}
                                            selectFieldId="rek-display-type"
                                            onChange={clearSubitems}
                                        >
                                            {publicationTypeItems}
                                        </Field>
                                    </Grid>
                                    {!!subitems && subitems.length > 0 && (
                                        <Grid item xs={12}>
                                            <Field
                                                component={SelectField}
                                                disabled={submitting}
                                                id="rek-subtype"
                                                name="rek_subtype"
                                                value={publicationSubtype}
                                                label={txt.publicationSubtype.inputLabelText}
                                                required
                                                placeholder={txt.publicationSubtype.hintText}
                                                selectFieldId="rek-subtype"
                                            >
                                                {subitems}
                                            </Field>
                                        </Grid>
                                    )}
                                </Grid>
                            </StandardCard>
                        </Grid>
                        {alertProps && (
                            <Grid item xs={12}>
                                <Alert testId="rek-changeDisplayType-submit-status" {...alertProps} />
                            </Grid>
                        )}
                        <Grid item xs={12}>
                            <Grid container spacing={2}>
                                <Grid item xs={false} sm />
                                <Grid item xs={12} sm="auto">
                                    <Button
                                        id="rek-changeDisplayType-cancel"
                                        data-testid="rek-changeDisplayType-cancel"
                                        disabled={saveRequesting}
                                        variant="contained"
                                        fullWidth
                                        onClick={() => navigateToViewPage(record.rek_pid)}
                                    >
                                        {txt.cancelButtonLabel}
                                    </Button>
                                </Grid>

                                <Grid item xs={12} sm="auto">
                                    <Button
                                        id="rek-changeDisplayType-submit"
                                        data-testid="rek-changeDisplayType-submit"
                                        variant="contained"
                                        color="primary"
                                        fullWidth
                                        onClick={() => handleSubmit(formValues, record)}
                                        disabled={disableSubmit || saveRequesting}
                                    >
                                        {txt.submit}
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                )}
            </StandardPage>
        </form>
    );
};

ChangeDisplayType.propTypes = {
    disableSubmit: PropTypes.bool,
    formValues: PropTypes.object,
    history: PropTypes.object,
    handleSubmit: PropTypes.func,
    loadingRecordToView: PropTypes.bool,
    loadRecordToView: PropTypes.func,
    publicationSubtype: PropTypes.array,
    publicationSubtypeItems: PropTypes.array,
    publicationTypeItems: PropTypes.array,
    record: PropTypes.object,
    resetSubType: PropTypes.func,
    saveFailed: PropTypes.bool,
    saveRequesting: PropTypes.bool,
    saveUpdated: PropTypes.bool,
    selectedPublicationType: PropTypes.object,
    submitSucceeded: PropTypes.bool,
    submitting: PropTypes.bool,
    subtypes: PropTypes.array,
};

ChangeDisplayType.defaultProps = {
    submitting: false,
};

export default ChangeDisplayType;
