import { useEffect, useRef, useState } from 'react';
import { useMapsLibrary } from '@vis.gl/react-google-maps';
import _ from 'lodash';
import { silentTryCatch } from 'helpers/general';

export type UseAutocompleteSuggestionsReturn = {
    suggestions: google.maps.places.AutocompleteSuggestion[];
    isLoading: boolean;
    resetSession: () => void;
};

export function useAutocompleteSuggestions(query: string): UseAutocompleteSuggestionsReturn {
    const sessionTokenRef = useRef<google.maps.places.AutocompleteSessionToken | null>(null);
    const [suggestions, setSuggestions] = useState<google.maps.places.AutocompleteSuggestion[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const { AutocompleteSessionToken, AutocompleteSuggestion } = useMapsLibrary('places') || {
        AutocompleteSessionToken: null,
        AutocompleteSuggestion: null,
    };

    const debouncedFetchAutocompleteSuggestions = useRef(
        _.debounce(
            async (input, sessionToken, api) => {
                setIsLoading(true);
                const result = await silentTryCatch(() => api.fetchAutocompleteSuggestions({ input, sessionToken }));
                setSuggestions(result?.suggestions ?? []);
                setIsLoading(false);
            },
            300,
            { trailing: true },
        ),
    ).current;

    useEffect(() => {
        if (!AutocompleteSessionToken || !AutocompleteSuggestion) return;

        const input = query?.trim?.();
        if (!input) {
            setSuggestions([]);
            return;
        }

        // see https://developers.google.com/maps/documentation/javascript/place-autocomplete-data#session-tokens
        if (!sessionTokenRef.current) sessionTokenRef.current = new AutocompleteSessionToken();
        debouncedFetchAutocompleteSuggestions(input, sessionTokenRef.current, AutocompleteSuggestion);
    }, [AutocompleteSessionToken, AutocompleteSuggestion, query]);

    return {
        suggestions,
        isLoading,
        // See the following doc. page to decide when to call resetSession()
        // https://developers.google.com/maps/documentation/javascript/place-autocomplete-data#session-tokens
        resetSession: () => {
            sessionTokenRef.current = null;
            setSuggestions([]);
        },
    };
}
