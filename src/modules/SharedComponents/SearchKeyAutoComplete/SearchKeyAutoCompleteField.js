import React from 'react';
import SearchKeyAutoComplete from './components/SearchKeyAutoComplete';

export default function SearchKeyAutoCompleteField(fieldProps) {
    return(<SearchKeyAutoComplete onChange={fieldProps.input.onChange} {...fieldProps} />);
}
