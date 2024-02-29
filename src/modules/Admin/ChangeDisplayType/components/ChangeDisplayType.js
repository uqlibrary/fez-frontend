import React from 'react';
import PropTypes from 'prop-types';
import { parseHtmlToJSX } from 'helpers/general';
import { useParams } from 'react-router-dom';
import { Field } from 'redux-form/immutable';
import { useConfirmationState } from 'hooks';

import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';

import { DOCUMENT_TYPES_EDIT_ONLY, publicationTypes } from 'config/general';
import { pathConfig, validation } from 'config';
import { default as componentsLocale } from 'locale/components';
import { default as publicationLocale } from 'locale/publicationForm';
import viewRecordLocale from 'locale/viewRecord';

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
    alertProps: {
        errorAlert: { ...publicationLocale.errorAlert },
        successAlert: { ...componentsLocale.components.changeDisplayType.successAlert },
        progressAlert: { ...componentsLocale.components.changeDisplayType.progressAlert },
        validationAlert: { ...publicationLocale.validationAlert },
    },
};

const renderTitle = record => {
    const prefixTxt = componentsLocale.components.changeDisplayType.title;
    const subtypeSuffix = !!record.rek_subtype ? ` - ${record.rek_subtype}` : '';
    const pageTitle = parseHtmlToJSX(`${prefixTxt}${record.rek_display_type_lookup}${subtypeSuffix}`);
    return (
        <Typography variant="h2" color="primary" style={{ fontSize: 24 }} data-testid="change-display-type-page-title">
            {pageTitle}
        </Typography>
    );
};

const _handleDefaultSubmit = event => {
    !!event && event.preventDefault();
};

export const ChangeDisplayType = ({
    disableSubmit,
    handleSubmit,
    loadingRecordToView,
    loadRecordToView,
    publicationSubtypeItems,
    record,
    resetSubType,
    saveRequesting,
    saveUpdated,
    saveFailed,
    submitting,
}) => {
    const { pid: pidParam } = useParams();
    /* istanbul ignore next */
    React.useEffect(() => {
        // Load record if it hasn't
        if (saveRequesting === null) {
            !!pidParam && (!record || record.rek_pid !== pidParam) && !!loadRecordToView && loadRecordToView(pidParam);
        }
    }, [loadRecordToView, pidParam, record, saveRequesting]);

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

    // tested in cypress changeDisplayType
    /* istanbul ignore next */
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

    const navigateToViewPage = () => {
        /* istanbul ignore else */
        if (!!pid && validation.isValidPid(pid)) {
            window.location.assign(pathConfig.records.view(pid, true));
        }
    };

    // tested in cypress changeDisplayType
    /* istanbul ignore next */
    const navigateToEditRecord = () => {
        if (!!pid && validation.isValidPid(pid)) {
            window.location.assign(pathConfig.admin.edit(pid));
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
                            onAction={navigateToEditRecord}
                            locale={txt.workflowConfirmation}
                            onCancelAction={navigateToViewPage}
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
                                        // tested in cypress changeDisplayType
                                        /* istanbul ignore next */
                                        <Grid item xs={12}>
                                            <Field
                                                component={SelectField}
                                                disabled={submitting}
                                                id="rek-subtype"
                                                name="rek_subtype"
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
                            // tested in cypress changeDisplayType
                            /* istanbul ignore next */
                            <Grid item xs={12}>
                                <Alert
                                    testId="change-display-type-submit-status"
                                    alertId="change-display-type-submit-status"
                                    {...alertProps}
                                />
                            </Grid>
                        )}
                        <Grid item xs={12}>
                            <Grid container spacing={2}>
                                <Grid item xs={false} sm />
                                <Grid item xs={12} sm="auto">
                                    <Button
                                        id="rek-change-display-type-cancel"
                                        data-analyticsid="rek-change-display-type-cancel"
                                        data-testid="rek-change-display-type-cancel"
                                        disabled={saveRequesting}
                                        variant="contained"
                                        fullWidth
                                        onClick={navigateToViewPage}
                                    >
                                        {txt.cancelButtonLabel}
                                    </Button>
                                </Grid>

                                <Grid item xs={12} sm="auto">
                                    <Button
                                        id="change-display-type-submit"
                                        data-analyticsid="change-display-type-submit"
                                        data-testid="change-display-type-submit"
                                        variant="contained"
                                        color="primary"
                                        fullWidth
                                        onClick={handleSubmit}
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
    handleSubmit: PropTypes.func,
    loadingRecordToView: PropTypes.bool,
    loadRecordToView: PropTypes.func,
    publicationSubtypeItems: PropTypes.array,
    publicationTypeItems: PropTypes.array,
    record: PropTypes.object,
    resetSubType: PropTypes.func,
    saveFailed: PropTypes.bool,
    saveRequesting: PropTypes.bool,
    saveUpdated: PropTypes.bool,
    submitting: PropTypes.bool,
};

ChangeDisplayType.defaultProps = {
    submitting: false,
};

export default ChangeDisplayType;
