import * as React from 'react';
import { AutoCompleteAsynchronousField } from 'modules/SharedComponents/Toolbox/AutoSuggestField';
import { KeyValueItemType } from 'hooks/useControlledVocabs';
import { matchSorter } from 'match-sorter';
import locale from 'locale/components';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../../../../reducer';
import { loadJournalSearchKeywords } from '../../../../actions';
import { keywordOnlySuffix } from '../../../../reducers/journals';
import { ForCodeAutocompleteOptionTemplate } from 'modules/SearchJournals/components/partials/ForCodeAutocompleteOptionTemplate';

type SubjectItem = Record<string, string | number>;
type OptionSource = { name: string };
type Option = Record<string, string | number | OptionSource[]>;
type ForCodeAutocompleteFieldProps = React.ComponentPropsWithoutRef<typeof AutoCompleteAsynchronousField> & {
    filter: (data: Option[]) => Option[];
};
type ForCodeAutocompleteFieldRef = React.ComponentRef<typeof AutoCompleteAsynchronousField>;

const toKeyValueList = (data: SubjectItem[]): Option[] =>
    data?.map?.(
        (item: SubjectItem): Option => ({
            key: item.jnl_subject_cvo_id,
            value: item.jnl_subject_title,
            sources: String(item.jnl_subject_sources)
                .split(',')
                .map(name => ({ name })),
        }),
    ) || [];

export const ForCodeAutocompleteField = React.forwardRef<ForCodeAutocompleteFieldRef, ForCodeAutocompleteFieldProps>(
    ({ filter, ...props }, ref) => {
        const txt = locale.components.searchJournals.partials.forCodeAutocompleteField;
        const dispatch = useDispatch();
        const fetch = (newValue: string) => dispatch(loadJournalSearchKeywords(newValue, true));
        const state = useSelector((s: AppState) => s.get('journalReducer')[keywordOnlySuffix]);
        const keyValueLists = React.useMemo(
            () => toKeyValueList(state.journalSearchKeywords?.subjectFuzzyMatch),
            [state.journalSearchKeywords?.subjectFuzzyMatch],
        );

        return (
            <AutoCompleteAsynchronousField
                // @ts-expect-error
                id="for-code-autocomplete-field"
                autoCompleteAsynchronousFieldId="for-code-autocomplete-field"
                itemsList={filter(keyValueLists)}
                itemsLoading={!!state.journalSearchKeywordsLoading}
                error={!!state.journalSearchKeywordsError}
                getOptionLabel={(option: Record<string, string | number>) =>
                    option?.value ?? /* istanbul ignore next */ ''
                }
                OptionTemplate={ForCodeAutocompleteOptionTemplate}
                allowFreeText={false}
                clearSuggestionsOnClose={false}
                loadSuggestions={fetch}
                placeholder={txt.input.placeholder}
                {...props}
                ref={ref}
            />
        );
    },
);

ForCodeAutocompleteField.displayName = 'ForCodeAutocompleteField';

export default React.memo(ForCodeAutocompleteField);
