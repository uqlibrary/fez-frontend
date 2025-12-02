import * as React from 'react';
import { AutoCompleteAsynchronousField } from 'modules/SharedComponents/Toolbox/AutoSuggestField';
import { KeyValueItemType } from 'hooks/useControlledVocabs';
import { matchSorter } from 'match-sorter';
import locale from 'locale/components';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../../../../reducer';
import { loadJournalSearchKeywords } from '../../../../actions';
import { keywordOnlySuffix } from '../../../../reducers/journals';
import { SearchKeyword } from 'modules/SearchJournals/components/partials/SearchKeyword';
import { Box } from '@mui/material';

export type ForCodeAutocompleteFieldProps = React.ComponentPropsWithoutRef<typeof AutoCompleteAsynchronousField> & {
    filter: (data: Array<Record<string, string | number>>) => Array<Record<string, string | number>>;
};

type ForCodeAutocompleteFieldRef = React.ComponentRef<typeof AutoCompleteAsynchronousField>;

export const ForCodeAutocompleteField = React.forwardRef<ForCodeAutocompleteFieldRef, ForCodeAutocompleteFieldProps>(
    ({ filter, ...props }, ref) => {
        const txt = locale.components.searchJournals.partials.forCodeAutocompleteField;
        const dispatch = useDispatch();
        const fetch = (newValue: string) => dispatch(loadJournalSearchKeywords(newValue, true));
        const state = useSelector((s: AppState) => s.get('journalReducer')[keywordOnlySuffix] || {});
        const keyValueLists =
            state.journalSearchKeywords?.subjectFuzzyMatch?.map?.((o: Record<string, string | number>) => ({
                key: o.jnl_subject_cvo_id,
                value: o.jnl_subject_title,
                sources: String(o.jnl_subject_sources)
                    .split(',')
                    .map(name => ({ name })),
            })) || [];
        const items = filter(keyValueLists);

        return (
            <AutoCompleteAsynchronousField
                // @ts-expect-error
                id="for-code-autocomplete-field"
                autoCompleteAsynchronousFieldId="for-code-autocomplete-field"
                // @ts-expect-error
                filterOptions={(options: KeyValueItemType[], { inputValue }) =>
                    matchSorter(options, inputValue ?? /* istanbul ignore next */ '', { keys: ['value'] })
                }
                itemsList={items}
                itemsLoading={state.journalsListLoading}
                error={!!state.journalSearchKeywordsError}
                getOptionLabel={(option: Record<string, string | number>) =>
                    option?.value ?? /* istanbul ignore next */ ''
                }
                OptionTemplate={({ option, index }: { option: Record<string, string | number>; index: number }) => (
                    <Box
                        sx={{
                            '& span[role=button]': {
                                fontSize: '.90em',
                                lineHeight: 0.6,
                            },
                        }}
                    >
                        <SearchKeyword
                            type="subject"
                            index={index}
                            keyword={option.value}
                            cvoId={option.value}
                            sources={option.sources}
                            selectedKeywords={{}}
                            onKeywordClick={undefined}
                        />
                    </Box>
                )}
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
