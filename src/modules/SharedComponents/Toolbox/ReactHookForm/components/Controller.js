import React from 'react';
import { Controller as Base } from 'react-hook-form';

// TODO convert to TSX
// eslint-disable-next-line react/prop-types
const Controller = ({ render, ...props }) => {
    return (
        <Base
            {...props}
            // required to avoid "A component is changing an uncontrolled input to be controlled" warnings
            /* eslint-disable-next-line react/prop-types */
            defaultValue={props.defaultValue || ''}
            render={({ field, fieldState, ...props }) =>
                render({
                    field: {
                        ...field,
                        // required for making it compatible custom component fields. e.g. CommunitySelectField,
                        meta: { error: fieldState.error?.message },
                    },
                    fieldState,
                    ...props,
                })
            }
        />
    );
};

export default Controller;
