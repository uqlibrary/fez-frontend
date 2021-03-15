import React from 'react';
import { AutoCompleteAsynchronousField } from 'modules/SharedComponents/Toolbox/AutoSuggestField';
import { connect } from 'react-redux';
import * as actions from 'actions';
import { JournalTemplate } from 'modules/SharedComponents/LookupFields';
import { ExternalLink } from 'modules/SharedComponents/ExternalLink';
import { APP_URL, PATH_PREFIX } from 'config';
import locale from 'locale/components';
import matchSorter from 'match-sorter';

const mapStateToProps = (state, props) => {
    const selectedJournalId =
        (!!props.input &&
            !!props.input.value &&
            ((!!props.input.value.toJS && props.input.value.toJS().id) || props.input.value.id)) ||
        (!!props.value && props.value.id);

    return {
        autoCompleteAsynchronousFieldId: props.journalIdFieldId || 'fez-matched-journals',
        itemsList:
            (state.get('journalReducer').itemsList &&
                state
                    .get('journalReducer')
                    .itemsList.map(item => ({ ...item, id: item.jnl_jid, value: item.jnl_title }))) ||
            [],
        itemsLoading: state.get('journalReducer').itemsLoading || false,
        allowFreeText: props.allowFreeText || false,
        errorText: props.meta ? props.meta.error : null,
        error: props.meta ? !!props.meta.error : null,
        getOptionLabel: (!!props.getOptionLabel && props.getOptionLabel) || (item => (item || {}).value || ''),
        filterOptions: (options, { inputValue }) => {
            return matchSorter(options, inputValue, { keys: ['value'] });
        },
        floatingLabelText: props.floatingLabelText || 'Journal Id',
        OptionTemplate: JournalTemplate,
        defaultValue:
            (!!props.input && selectedJournalId && { id: `${selectedJournalId}` }) ||
            (!!props.value && props.value) ||
            '',
        supplemental: !!selectedJournalId && (
            <ExternalLink
                id={`journal-${selectedJournalId}-details`}
                data-testid={`journal-${selectedJournalId}-details`}
                href={`${APP_URL}${PATH_PREFIX}journal/view/${selectedJournalId}`}
                title={locale.components.JournalIdField.detailsLink.title}
                rel=""
            >
                {locale.components.JournalIdField.detailsLink.linkText}
            </ExternalLink>
        ),
        ...(!!((props || {}).meta || {}).form
            ? {
                  error: !!props.meta.error,
                  errorText: props.meta.error || '',
              }
            : {
                  error: props.error,
                  errorText: props.errorText || '',
              }),
    };
};

const mapDispatchToProps = (dispatch, props) => ({
    loadSuggestions: (searchQuery = ' ') => dispatch(actions.loadJournalLookup(searchQuery)),
    onChange: (!!props.input && (item => props.input.onChange(item))) || (item => props.onChange(item)),
    onClear: (!!props.input && (() => props.input.onChange(null))) || (() => props.onChange({})),
});

export const JournalIdField = connect(mapStateToProps, mapDispatchToProps)(AutoCompleteAsynchronousField);
