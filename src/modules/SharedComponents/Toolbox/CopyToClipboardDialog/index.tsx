import React, { useRef } from 'react';
import { Dialog, DialogContent, DialogTitle, IconButton, InputAdornment } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CloseIcon from '@mui/icons-material/Close';
import { TextField } from 'modules/SharedComponents/Toolbox/TextField';

type CopyDialogProps = {
    title: string | React.ReactNode;
    open: boolean;
    text: string;
    onCopy: () => void;
    onClose: () => void;
};

const CopyToClipboardDialog = ({ title, open, text, onCopy, onClose }: CopyDialogProps) => {
    const inputRef = useRef<HTMLInputElement>(null);

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            slotProps={{
                transition: {
                    onEntered: () => {
                        inputRef.current?.focus();
                        inputRef.current?.select();
                    },
                },
                paper: { sx: { pb: 1 } },
            }}
        >
            <DialogTitle
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                {title}

                <IconButton onClick={onClose} aria-label="close" edge="end">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent>
                <TextField
                    data-testid="copy-to-clipboard-dialog"
                    // @ts-expect-error TODO fix once converted to TS
                    fullWidth
                    value={text}
                    inputRef={inputRef}
                    InputProps={{
                        readOnly: true,
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={onCopy}
                                    color="info"
                                    edge="end"
                                    data-testid="copy-to-clipboard-dialog-copy=button"
                                >
                                    <ContentCopyIcon />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                    onFocus={(e: { target: { select: () => FocusEvent } }) => e.target.select()}
                />
            </DialogContent>
        </Dialog>
    );
};

export default React.memo(CopyToClipboardDialog);
