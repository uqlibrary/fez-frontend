import * as React from 'react';
import { FOR_CODE_VOCAB_ID as rootCvoId } from 'config/general';
import { AutoCompleteAsynchronousField } from 'modules/SharedComponents/Toolbox/AutoSuggestField';
import { FoROptionTemplate } from 'modules/SharedComponents/LookupFields';
import { KeyValueItemType, TransformerType, useControlledVocabs } from 'hooks/useControlledVocabs';
import { matchSorter } from 'match-sorter';

export type ForCodeAutocompleteFieldProps = React.ComponentPropsWithoutRef<typeof AutoCompleteAsynchronousField> & {
    filter: TransformerType;
};

type ForCodeAutocompleteFieldRef = React.ElementRef<typeof AutoCompleteAsynchronousField>;

export const ForCodeAutocompleteField = React.forwardRef<ForCodeAutocompleteFieldRef, ForCodeAutocompleteFieldProps>(
    ({ filter, ...props }, ref) => {
        const { items, itemsLoading, fetch } = useControlledVocabs(rootCvoId, filter);

        return (
            <AutoCompleteAsynchronousField
                // @ts-expect-error
                id="for-code-autocomplete-field"
                autoCompleteAsynchronousFieldId="for-code-autocomplete-field"
                // @ts-expect-error
                filterOptions={(options: KeyValueItemType[], { inputValue }) =>
                    matchSorter(options, inputValue ?? '', { keys: ['group', 'value'] })
                }
                itemsList={items}
                itemsLoading={itemsLoading}
                getOptionLabel={(option: KeyValueItemType) => option?.value ?? ''}
                OptionTemplate={FoROptionTemplate}
                allowFreeText={false}
                clearSuggestionsOnClose={false}
                loadSuggestions={fetch}
                placeholder="type new subject"
                {...props}
                ref={ref}
            />
        );
    },
);

ForCodeAutocompleteField.displayName = 'ForCodeAutocompleteField';

export default React.memo(ForCodeAutocompleteField);
