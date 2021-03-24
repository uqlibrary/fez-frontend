import React from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

import { makeStyles } from '@material-ui/core/styles';

import { ScrollToSection } from 'modules/SharedComponents/Toolbox/ScrollToSection';
import NameData from './NameData';
import NotesData from './NotesData';
import UsernameIdData from './UsernameIdData';
import ResearcherIdentifierData from './ResearcherIdentifierData';

const useStyles = makeStyles(theme => ({
    background: {
        backgroundColor: theme.palette.secondary.light,
        padding: theme.spacing(2),
    },
}));

export const FullAuthorDetails = ({
    disabled,
    data: rowData,
    mode,
    onEditingApproved,
    onEditingCanceled,
    ...props
}) => {
    const classes = useStyles();

    const [data, setData] = React.useState(rowData || {});

    const handleChange = (name, value) => setData(data => ({ ...data, [name]: value }));

    const handleSave = () => {
        const newData = data;
        delete newData.tableData;
        onEditingApproved(mode, data, rowData);
    };

    const handleCancel = () => onEditingCanceled(mode, rowData);

    return (
        <TableRow>
            {(mode === 'update' || mode === 'add') && (
                <TableCell colSpan={3}>
                    <ScrollToSection scrollToSection>
                        <div className={classes.background}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <NameData {...props} rowData={data} onChange={handleChange} />
                                </Grid>
                                <Grid item xs={12}>
                                    <UsernameIdData {...props} rowData={data} onChange={handleChange} />
                                </Grid>
                                <Grid item xs={12}>
                                    <ResearcherIdentifierData {...props} rowData={data} onChange={handleChange} />
                                </Grid>
                                <Grid item xs={12}>
                                    <NotesData {...props} rowData={data} onChange={handleChange} />
                                </Grid>
                                <Grid item xs={12}>
                                    <Grid
                                        container
                                        direction="row-reverse"
                                        justify="flex-start"
                                        alignItems="center"
                                        spacing={2}
                                    >
                                        <Grid item>
                                            <Button
                                                id="authors-update-this-author-save"
                                                data-testid="authors-update-this-author-save"
                                                disabled={disabled}
                                                variant="contained"
                                                color="primary"
                                                onClick={handleSave}
                                            >
                                                Update this author
                                            </Button>
                                        </Grid>
                                        <Grid item>
                                            <Button
                                                id="authors-update-this-author-cancel"
                                                data-testid="authors-update-this-author-cancel"
                                                disabled={disabled}
                                                variant="outlined"
                                                color="secondary"
                                                onClick={handleCancel}
                                            >
                                                Cancel
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </div>
                    </ScrollToSection>
                </TableCell>
            )}
        </TableRow>
    );
};

FullAuthorDetails.propTypes = {
    data: PropTypes.object,
    disabled: PropTypes.bool,
    mode: PropTypes.string,
    onEditingApproved: PropTypes.func,
    onEditingCanceled: PropTypes.func,
    rowData: PropTypes.object,
};

export default React.memo(FullAuthorDetails);
