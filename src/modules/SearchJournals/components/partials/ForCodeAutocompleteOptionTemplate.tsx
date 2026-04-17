import React from 'react';
import { Box } from '@mui/material';
import { SearchKeyword } from 'modules/SearchJournals/components/partials/SearchKeyword';

interface ForCodeAutocompleteOptionTemplateProps {
    option: Record<string, string | number>;
    index: number;
}

export const ForCodeAutocompleteOptionTemplate = ({ option, index }: ForCodeAutocompleteOptionTemplateProps) => (
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
);

export default React.memo(ForCodeAutocompleteOptionTemplate);
