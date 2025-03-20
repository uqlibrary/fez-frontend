import React, { useEffect } from 'react';
import { parseHtmlToJSX } from 'helpers/general';
import { useNavigate, useParams } from 'react-router-dom';
import { useConfirmationState, useForm, usePublicationSubtype } from 'hooks';

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
import { Field } from '../../../SharedComponents/Toolbox/ReactHookForm';
import { useDispatch, useSelector } from 'react-redux';
import { useWatch } from 'react-hook-form';
import { changeDisplayType, loadRecordToView } from '../../../../actions';
import { WorkNotFound } from '../../../NotFound/components/WorkNotFound';

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
    const subtypeSuffix = !!record.rek_subtype && ` - ${record.rek_subtype}`;
    const pageTitle = parseHtmlToJSX(`${prefixTxt}${record.rek_display_type_lookup}${subtypeSuffix}`);
    return (
        <Typography variant="h2" color="primary" style={{ fontSize: 24 }} data-testid="change-display-type-page-title">
            {pageTitle}
        </Typography>
    );
};

export const ChangeDisplayType = () => {
    const { pid } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { recordToView: record, loadingRecordToView } = useSelector(state => state.get('viewRecordReducer'));
    const [isOpen, showConfirmation, hideConfirmation] = useConfirmationState();

    const {
        control,
        setValue,
        getPropsForAlert,
        safelyHandleSubmit,
        formState: { isSubmitting, isSubmitSuccessful },
    } = useForm({
        defaultValues: {
            rek_display_type: null,
            rek_subtype: null,
        },
    });

    const [displayType, subtype] = useWatch({ control, name: ['rek_display_type', 'rek_subtype'] });
    const subtypes = usePublicationSubtype(displayType || null, true);

    // handles loading record on mount
    useEffect(() => {
        /* istanbul ignore next */
        if (!pid || record?.rek_pid) return;
        dispatch(loadRecordToView(pid));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // handles displayType changes
    useEffect(() => {
        setValue('rek_subtype', null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [displayType, setValue]);

    // handles displaying confirmation dialog
    useEffect(() => {
        if (!isSubmitSuccessful) return;
        showConfirmation();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSubmitSuccessful]);

    if (pid && loadingRecordToView) {
        return <InlineLoader message={txt.loadingMessage} />;
    }
    if (!pid || !record?.rek_pid) {
        return <WorkNotFound />;
    }

    const typeItems = [
        ...Object.values(publicationTypes())
            .filter(pubType => !DOCUMENT_TYPES_EDIT_ONLY.includes(pubType.id))
            .map((item, index) => {
                return (
                    <MenuItem value={item.id} key={index}>
                        {item.name}
                    </MenuItem>
                );
            }),
    ];
    const subitems =
        !!subtypes && subtypes.length > 0
            ? [
                  ...subtypes.map((item, index) => (
                      <MenuItem value={item} key={index}>
                          {item}
                      </MenuItem>
                  )),
              ]
            : [];
    const alertProps = validation.getErrorAlertProps({
        alertLocale: txt.alertProps,
        ...getPropsForAlert(),
    });

    const navigateToViewPage = () => navigate(pathConfig.records.view(pid));
    const navigateToEditRecord = () => navigate(pathConfig.admin.edit(pid));
    const onSubmit = safelyHandleSubmit(data => dispatch(changeDisplayType([record], data)));

    return (
        <form>
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
                                            control={control}
                                            component={SelectField}
                                            disabled={isSubmitting}
                                            name="rek_display_type"
                                            id="rek-display-type"
                                            label={txt.publicationType.inputLabelText}
                                            required
                                            placeholder={txt.publicationType.hintText}
                                            selectFieldId="rek-display-type"
                                        >
                                            {typeItems}
                                        </Field>
                                    </Grid>
                                    {!!subitems && subitems.length > 0 && (
                                        // tested in cypress changeDisplayType
                                        /* istanbul ignore next */
                                        <Grid item xs={12}>
                                            <Field
                                                control={control}
                                                component={SelectField}
                                                disabled={isSubmitting}
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
                                        disabled={isSubmitting}
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
                                        onClick={onSubmit}
                                        disabled={
                                            isSubmitting ||
                                            isSubmitSuccessful ||
                                            !displayType ||
                                            (!!subtypes?.length && !subtype)
                                        }
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

export default ChangeDisplayType;
