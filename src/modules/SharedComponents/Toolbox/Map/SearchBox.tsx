import React, { useCallback, useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import { useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import { useAutocompleteSuggestions } from './hooks/useAutocompleteSuggestions';
import { Box } from '@mui/material';

type SearchBoxProps = { onPlaceSelect: (place: google.maps.places.Place) => void };

const SearchBox: React.FC<SearchBoxProps> = ({ ...containerProps }) => {
    const map = useMap();
    const places = useMapsLibrary('places');
    const [open, setOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const { suggestions, isLoading, resetSession } = useAutocompleteSuggestions(inputValue);

    const onSelectSuggestion = useCallback(
        async (suggestion: google.maps.places.AutocompleteSuggestion | null) => {
            if (!map || !places || !suggestion || !suggestion?.placePrediction) return;

            const place = suggestion.placePrediction.toPlace();
            await place.fetchFields({
                fields: ['viewport', 'location', 'svgIconMaskURI', 'iconBackgroundColor'],
            });
            // center map to selected place
            /* istanbul ignore else */
            if (place.viewport) map.fitBounds(place.viewport);

            setInputValue('');
            resetSession();
        },
        [map, places, resetSession],
    );

    return (
        <Box {...containerProps}>
            <Autocomplete
                id="map-search-box"
                data-testid="map-search-box"
                fullWidth
                loading={isLoading}
                inputValue={inputValue}
                onInputChange={(_, value) => setInputValue(value)}
                noOptionsText={null}
                options={(inputValue && suggestions) || []}
                open={open && !!inputValue?.length && !!suggestions.length}
                onOpen={() => suggestions.length && setOpen(true)}
                onClose={() => setOpen(false)}
                onChange={async (_, suggestion) => {
                    // istanbul ignore next
                    if (suggestion === null) return;
                    await onSelectSuggestion(suggestion);
                }}
                getOptionKey={suggestion => String(suggestion?.placePrediction?.placeId)}
                getOptionLabel={suggestion => String(suggestion?.placePrediction?.text?.text)}
                isOptionEqualToValue={(option, value) =>
                    option?.placePrediction?.placeId === value?.placePrediction?.placeId
                }
                slotProps={{
                    paper: {
                        sx: {
                            fontSize: '14px',
                            marginTop: '1px',
                            borderRadius: 0,
                            boxShadow: '0 2px 6px rgba(0,0,0,.3)',
                            minHeight: '32px',
                        },
                    },
                }}
                sx={{
                    '& .MuiOutlinedInput-root': {
                        backgroundColor: '#fff',
                        borderRadius: '2px',
                        paddingRight: '12px !important',
                        boxShadow: '0 1px 4px rgba(0,0,0,.3)',
                        '& fieldset': { border: 'none !important' },
                        '&:hover fieldset': { border: 'none !important' },
                    },
                }}
                renderInput={params => (
                    <TextField
                        {...params}
                        size="small"
                        placeholder="Search..."
                        slotProps={{
                            inputLabel: { shrink: false },
                            input: {
                                ...params.InputProps,
                                endAdornment: (isLoading && <CircularProgress size={18} />) || null,
                            },
                        }}
                        sx={{
                            width: '100%',
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '2px',
                                boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
                                height: 40,
                            },
                            '& .MuiInputBase-input': {
                                marginTop: '2px',
                                fontSize: '14px',
                                '&::placeholder': {
                                    color: '#000',
                                    opacity: 0.9,
                                },
                            },
                        }}
                    />
                )}
            />
        </Box>
    );
};

export default React.memo(SearchBox);
