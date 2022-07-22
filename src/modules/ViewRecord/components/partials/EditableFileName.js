import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';

import FileName from './FileName';
import { FileNameProps } from './FileName';

const EditableFileName = ({ isEditing, onFilenameChange, ...props }) => {
    // eslint-disable-next-line no-unused-vars
    const isEdited = useRef(false);
    const originalFilenameRef = useRef(props.filename);

    const onFilenameChangeProxy = event => {
        event.target.value !== originalFilenameRef.current && (isEdited.current = true);
        onFilenameChange(event);
    };

    console.log(props);

    return (
        <>
            {!isEditing ? (
                <FileName {...props} />
            ) : (
                <TextField
                    autoFocus
                    value={props.fileName}
                    onChange={e => onFilenameChangeProxy(e)}
                    id={`${props.id}`}
                    data-testid={`${props.id}`}
                /> /* Maybe change textfiled to Input, so we can add adornments such as tick and X buttons to accept or cancel edits (may need reset button too).
                Also have to prevent the onchange firing every time the text changes but the control hasnt lost focus.   */
            )}
        </>
    );
};

export const EditableFileNameProps = {
    isEditing: PropTypes.bool,
    onFilenameChange: PropTypes.func,
    ...FileNameProps,
};

EditableFileName.propTypes = { ...EditableFileNameProps };

export default EditableFileName;
