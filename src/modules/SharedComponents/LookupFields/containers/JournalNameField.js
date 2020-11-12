import React from 'react';
import { AutoCompleteAsynchronousField } from 'modules/SharedComponents/Toolbox/AutoSuggestField';
import { connect } from 'react-redux';
import * as actions from 'actions';
import { JournalTemplate } from 'modules/SharedComponents/LookupFields';
import { ExternalLink } from 'modules/SharedComponents/ExternalLink';
import { APP_URL, PATH_PREFIX } from 'config';
import locale from 'locale/components';

const mapStateToProps = (state, props) => {
    const { itemsList = [], itemsLoading = false } = state.get('journalReducer');
    const selectedItem = itemsList.find(item => item.jnl_title === props.input.value);
    return {
        autoCompleteAsynchronousFieldId: props.journalNameFieldId || 'rek-journal-name',
        itemsList,
        itemsLoading,
        allowFreeText: true,
        errorText: props.meta ? props.meta.error : null,
        error: props.meta ? !!props.meta.error : null,
        getOptionLabel: item => item.jnl_title,
        filterOptions: options => options,
        floatingLabelText: props.floatingLabelText || 'Journal name',
        OptionTemplate: JournalTemplate,
        supplemental: !!selectedItem && (
            <ExternalLink
                id={`journal-${selectedItem.jnl_jid}-details`}
                data-testid={`journal-${selectedItem.jnl_jid}-details`}
                href={`${APP_URL}${PATH_PREFIX}journal/view/${selectedItem.jnl_jid}`}
                title={locale.components.journalNameField.detailsLink.title}
                rel=""
            >
                {locale.components.journalNameField.detailsLink.linkText}
            </ExternalLink>
        ),
    };
};

const mapDispatchToProps = (dispatch, props) => ({
    loadSuggestions: (searchQuery = ' ') => dispatch(actions.loadJournalLookup(searchQuery)),
    onChange: item => props.input.onChange(item.jnl_title || item.value),
    onClear: () => props.input.onChange(null),
});

export const JournalNameField = connect(mapStateToProps, mapDispatchToProps)(AutoCompleteAsynchronousField);
