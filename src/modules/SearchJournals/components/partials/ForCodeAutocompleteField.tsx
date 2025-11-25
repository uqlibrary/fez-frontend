import * as React from 'react';
import { FOR_CODE_VOCAB_ID as rootCvoId } from 'config/general';
import { AutoCompleteAsynchronousField } from 'modules/SharedComponents/Toolbox/AutoSuggestField';
import { FoROptionTemplate } from 'modules/SharedComponents/LookupFields';
import { useControlledVocabs } from 'hooks/useControlledVocabs';
import { matchSorter } from 'match-sorter';

export const ForCodeAutocompleteField: React.FC<React.ComponentPropsWithRef<any>> = React.forwardRef((props, ref) => {
    const { items, itemsLoading, fetch } = useControlledVocabs(rootCvoId);
    return (
        <AutoCompleteAsynchronousField
            id="for-code-autocomplete-field"
            autoCompleteAsynchronousFieldId="for-code-autocomplete-field"
            // @ts-expect-error
            filterOptions={(options, { inputValue }) => matchSorter(options, inputValue, { keys: ['group', 'value'] })}
            itemsList={items}
            itemsLoading={itemsLoading}
            getOptionLabel={() => ''}
            OptionTemplate={FoROptionTemplate}
            allowFreeText={false}
            clearSuggestionsOnClose={false}
            loadSuggestions={fetch}
            placeholder={'type new subject'}
            {...props}
            inputRef={ref}
        />
    );
});

export default React.memo(ForCodeAutocompleteField);
