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
    const itemsList = state
        .get('journalReducer')
        .itemsList.map(item => ({ ...item, id: item.jnl_jid, value: item.jnl_title }));

    return {
        autoCompleteAsynchronousFieldId: props.journalNameFieldId || 'journal-name',
        itemsList,
        itemsLoading: state.get('journalReducer').itemsLoading || false,
        allowFreeText: props.allowFreeText || false,
        errorText: props.meta ? props.meta.error : props.error,
        error: props.meta ? !!props.meta.error : !!props.error,
        getOptionLabel: item => (item || {}).value || '',
        filterOptions: (options, { inputValue }) => {
            return matchSorter(options, inputValue, { keys: ['value'] });
        },
        floatingLabelText: props.floatingLabelText || 'Journal name',
        OptionTemplate: JournalTemplate,
        defaultValue: (!!props.input && { value: props.input.value }) || props.value,
        supplemental: !!props.selectedJournal && (
            <ExternalLink
                id={`journal-${props.selectedJournal.id}-details`}
                data-testid={`journal-${props.selectedJournal.id}-details`}
                href={`${APP_URL}${PATH_PREFIX}journal/view/${props.selectedJournal.id}`}
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
    onChange: item => (!!props.input && props.input.onChange(item)) || props.onChange(item),
    onClear: () => (!!props.input && props.input.onChange(null)) || props.onChange({}),
});

export const JournalNameField = connect(mapStateToProps, mapDispatchToProps)(AutoCompleteAsynchronousField);
