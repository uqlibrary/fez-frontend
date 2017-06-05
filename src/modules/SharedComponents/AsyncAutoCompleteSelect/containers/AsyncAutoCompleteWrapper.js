import React from 'react';
import PropTypes from 'prop-types';
import AsyncAutoCompleteSelect from '../components/AsyncAutoCompleteSelect.component';

import propFilter from './filterProps';
import {HelpIcon} from 'uqlibrary-react-toolbox';

const UQAsyncAutoCompleteSelect = props => {
    const filteredProps = propFilter(props, AsyncAutoCompleteSelect.propTypes);
    return (
        <div style={{position: 'relative', width: '100%'}}>
            <AsyncAutoCompleteSelect {...filteredProps} />
            {props.helpText && (
                <div style={{position: 'absolute', right: 0, top: 0}}>
                    <HelpIcon title={props.helpTitle} text={props.helpText} buttonLabel="Got it!" />
                </div>
            )}
        </div>
    );
};

UQAsyncAutoCompleteSelect.propTypes = {
    ...AsyncAutoCompleteSelect.propTypes,
    helpTitle: PropTypes.string,
    helpText: PropTypes.any
};

export default UQAsyncAutoCompleteSelect;
