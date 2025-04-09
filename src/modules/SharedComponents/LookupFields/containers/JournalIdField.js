/* eslint-disable react/prop-types */
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import { AutoCompleteAsynchronousField } from 'modules/SharedComponents/Toolbox/AutoSuggestField';

import * as actions from 'actions';
import { JournalTemplate } from 'modules/SharedComponents/LookupFields';
import { ExternalLink } from 'modules/SharedComponents/ExternalLink';
import { APP_URL, PATH_PREFIX } from 'config';
import locale from 'locale/components';
import { matchSorter } from 'match-sorter';

export const JournalIdField = props => {
    const dispatch = useDispatch();
    const loadSuggestions = (searchQuery = ' ') => dispatch(actions.loadJournalLookup(searchQuery));

    const selectedJournalId = props.input?.value?.id || props.value?.id;

    const _itemsList = useSelector(state => state.get('journalReducer').itemsList || []);
    const itemsList = React.useMemo(
        () => _itemsList.map(item => ({ ...item, id: item.jnl_jid, value: item.jnl_title })),
        [_itemsList],
    );
    const itemsLoading = useSelector(state => state.get('journalReducer').itemsLoading || false);

    return (
        <AutoCompleteAsynchronousField
            {...props}
            id={props.id}
            itemsList={itemsList}
            autoCompleteAsynchronousFieldId={props.journalIdFieldId || 'fez-matched-journals'}
            itemsLoading={itemsLoading}
            allowFreeText={props.allowFreeText || false}
            errorText={props.state ? props.state.error : null}
            error={!!props.state?.error}
            getOptionLabel={(!!props.getOptionLabel && props.getOptionLabel) || (item => (item || {}).value || '')}
            filterOptions={(options, { inputValue }) => {
                return matchSorter(
                    options,
                    inputValue
                        .replace(/&|\sand\s/gi, ' ')
                        .replace(/\s{2,}/g, ' ')
                        .trim(),
                    { keys: ['value'] },
                );
            }}
            floatingLabelText={props.floatingLabelText || 'Journal Id'}
            OptionTemplate={JournalTemplate}
            defaultValue={
                (!!props.input && !!selectedJournalId && { id: `${selectedJournalId}` }) ||
                (!!props.value && props.value) ||
                null
            }
            supplemental={
                !!selectedJournalId && (
                    <ExternalLink
                        id={`journal-${selectedJournalId}-details`}
                        data-testid={`journal-${selectedJournalId}-details`}
                        href={`${APP_URL}${PATH_PREFIX}journal/view/${selectedJournalId}`}
                        title={locale.components.JournalIdField.detailsLink.title}
                        rel=""
                    >
                        {locale.components.JournalIdField.detailsLink.linkText}
                    </ExternalLink>
                )
            }
            error={props.error}
            errorText={props.errorText || ''}
            loadSuggestions={loadSuggestions}
            onChange={(!!props.input && (item => props.input.onChange(item))) || (item => props.onChange(item))}
            onClear={(!!props.input && (() => props.input.onChange(null))) || (() => props.onChange({}))}
        />
    );
};

JournalIdField.propTypes = {
    props: PropTypes.object,
};
export default React.memo(JournalIdField);
