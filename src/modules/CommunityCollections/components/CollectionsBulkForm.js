import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { propTypes } from 'redux-form/immutable';
import { Field } from 'redux-form/immutable';
// import { Alert } from 'modules/SharedComponents/Toolbox/Alert';
import { NavigationDialogBox } from 'modules/SharedComponents/Toolbox/NavigationPrompt';
// import { TextField } from 'modules/SharedComponents/Toolbox/TextField';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
// import { NewListEditorField, KeywordsForm } from 'modules/SharedComponents/Toolbox/ListEditor';
import { validation } from 'config';
// import { default as formLocale } from 'locale/publicationForm';
// import locale from 'locale/components';

import { ConfirmDiscardFormChanges } from 'modules/SharedComponents/ConfirmDiscardFormChanges';
import { CommunitySelectField } from 'modules/SharedComponents/SelectFields';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { pathConfig } from 'config/pathConfig';

// import queryString from 'query-string';

export default class CollectionsBulkForm extends Component {
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
        collectionsSelected: PropTypes.array,
        collectionsSelectedParent: PropTypes.string,
        newCollectionSaving: PropTypes.bool,
        newCollectionError: PropTypes.bool,
        newRecord: PropTypes.object,
    };

    static contextTypes = {
        selectFieldMobileOverrides: PropTypes.object,
    };

    constructor(props) {
        super(props);
    }

    cancelSubmit = () => {
        window.location.assign(pathConfig.index);
    };

    afterSubmit = () => {
        window.location.assign(pathConfig.index);
    };

    reloadForm = () => {
        window.location.reload();
    };

    render() {
        // let hasParams = false;

        // const queryStringObject = queryString.parse(
        //     location && ((location.hash && location.hash.replace('?', '&').replace('#', '?')) || location.search),
        //     { ignoreQueryPrefix: true },
        // );
        // if (queryStringObject?.pid && queryStringObject?.name) {
        //     hasParams = true;
        // }
        // const txt = locale.pages.communityCollections.bulkMoveCollections;
        const txt = {
            title: 'Bulk move collections',
            afterSubmitTitle: 'Submitted',
            reloadFormButton: 'reload',
            formLabels: {
                ismemberof: {
                    label: 'Select a destination community',
                    ariaLabel: 'Select a destination community',
                    selectPrompt: 'Please select a destination community',
                    loadingHint: 'Loading communities...',
                },
            },
            submit: {
                move: 'Move collections',
            },
        };
        // const detailsTitle = !!hasParams
        //     ? `New collection in community '${queryStringObject.name}'`
        //     : txt.details.title;
        if (!this.props.collectionsSelected || this.props.collectionsSelected.length < 1) {
            return (
                <StandardPage title={txt.title}>
                    <Typography>You cannot navigate to this page directly</Typography>
                </StandardPage>
            );
        }
        if (this.props.submitSucceeded) {
            <StandardPage title={txt.title}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <StandardCard title={txt.afterSubmitTitle}>
                            <Typography>{txt.afterSubmitText}</Typography>
                        </StandardCard>
                    </Grid>
                </Grid>
                <Grid container spacing={2}>
                    <Grid item xs />
                    <Grid item>
                        <Button variant="contained" fullWidth onClick={this.reloadForm}>
                            {txt.reloadFormButton}
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button variant="contained" color="primary" fullWidth onClick={this.afterSubmit}>
                            {txt.afterSubmitButton}
                        </Button>
                    </Grid>
                </Grid>
            </StandardPage>;
        }
        // const collectionString =
        //    this.props.collectionsSelected.length > 0 && this.props.collectionsSelected.map(e => e.title).join(', ');
        return (
            <StandardPage title={txt.title}>
                <ConfirmDiscardFormChanges dirty={this.props.dirty} submitSucceeded={this.props.submitSucceeded}>
                    <form>
                        <NavigationDialogBox
                            when={this.props.dirty && !this.props.submitSucceeded}
                            txt={txt.cancelWorkflowConfirmation}
                        />
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <StandardCard title={txt.title} help={txt.help}>
                                    <Typography>Moving the following collections:</Typography>
                                    <ul>
                                        {this.props.collectionsSelected.map(e => (
                                            <li>{e.title}</li>
                                        ))}
                                    </ul>
                                    <Grid
                                        container
                                        spacing={3}
                                        id="community-selector"
                                        data-testid="community-selector"
                                    >
                                        <Grid item xs={12}>
                                            <Field
                                                component={CommunitySelectField}
                                                disabled={this.props.submitting}
                                                genericSelectFieldId="rek-ismemberof"
                                                name="fez_record_search_key_ismemberof"
                                                required
                                                validate={[validation.required]}
                                                {...txt.formLabels.ismemberof}
                                            />
                                        </Grid>
                                    </Grid>
                                </StandardCard>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm="auto">
                                <Button
                                    data-testid="submit-collection"
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    onClick={this.props.handleSubmit}
                                    disabled={this.props.submitting || this.props.disableSubmit}
                                >
                                    {txt.submit.move}
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </ConfirmDiscardFormChanges>
            </StandardPage>
        );
    }
}
