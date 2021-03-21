import React from 'react';
import PropTypes from 'prop-types';

import Popper from '@material-ui/core/Popper';
import Fade from '@material-ui/core/Fade';
import Paper from '@material-ui/core/Paper';
import Comment from '@material-ui/icons/Comment';
import Notes from '@material-ui/icons/Notes';

import AuthorNotesField from './AuthorNotesField';

import { useEditableContext } from 'context';

export const AuthorNotesButton = ({ iconProps, rowData }) => {
    const { editable } = useEditableContext();

    const [notesButton, setNotesButton] = React.useState(null);
    const [open, setOpen] = React.useState(false);

    const handleNotesOpen = e => {
        setNotesButton(e.currentTarget);
        setOpen(open => !open);
    };

    const handleNotesClose = notes => {
        setNotesButton(null);
        setOpen(false);
        rowData.aut_description = notes;
    };

    return (
        <React.Fragment>
            {editable ? (
                <Comment {...iconProps} aria-describedby="notes-popper" onClick={handleNotesOpen} />
            ) : (
                <Notes {...iconProps} aria-describedby="notes-popper" onClick={handleNotesOpen} />
            )}
            <Popper id="notes-popper" open={open} anchorEl={notesButton} position="left" transition>
                {({ TransitionProps }) => (
                    <Fade {...TransitionProps} timeout={350}>
                        <Paper elevation={3}>
                            <AuthorNotesField rowData={rowData} onChange={handleNotesClose} />
                        </Paper>
                    </Fade>
                )}
            </Popper>
        </React.Fragment>
    );
};

AuthorNotesButton.propTypes = {
    iconProps: PropTypes.object,
    rowData: PropTypes.object,
};
export default React.memo(AuthorNotesButton);
