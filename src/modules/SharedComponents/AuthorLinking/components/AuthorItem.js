import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { numberToWords } from 'config';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import withStyles from '@mui/styles/withStyles';
import RadioButtonUnchecked from '@mui/icons-material/RadioButtonUnchecked';
import RadioButtonChecked from '@mui/icons-material/RadioButtonChecked';
import Link from '@mui/icons-material/Link';

export const styles = theme => ({
    authorLinkIcon: {
        marginRight: theme.spacing(),
    },
    buttonBase: {
        justifyContent: 'flex-start',
        marginBottom: theme.spacing(-1),
        marginTop: theme.spacing(1),
    },
    authorOrder: {
        marginLeft: theme.spacing(5),
        marginBottom: theme.spacing(2),
    },
});

export class AuthorItem extends PureComponent {
    static propTypes = {
        authorItemId: PropTypes.string,
        type: PropTypes.string,
        linked: PropTypes.bool,
        selected: PropTypes.bool,
        disabled: PropTypes.bool,
        author: PropTypes.object,
        onAuthorSelected: PropTypes.func,
        locale: PropTypes.object,
        index: PropTypes.number,
        classes: PropTypes.object,
    };

    static defaultProps = {
        locale: {
            suffix: ' listed [type]',
        },
    };

    /**
     * On author selected
     *
     * @private
     */
    _selectAuthor = () => {
        this.props.onAuthorSelected && this.props.onAuthorSelected(this.props.author);
    };

    /**
     * Get status icon for an author based on attributes
     *
     * @param linked
     * @param selected
     * @returns {XML}
     */
    getAuthorItemStatusIcon = (linked, selected) => {
        if (!linked && !selected) {
            return <RadioButtonUnchecked className={this.props.classes.authorLinkIcon} color="secondary" />;
        } else if (linked) {
            return <Link className={this.props.classes.authorLinkIcon} />;
        } else {
            return <RadioButtonChecked className={this.props.classes.authorLinkIcon} color="primary" />;
        }
    };

    render() {
        const { linked, author, selected, index } = this.props;
        const { suffix } = this.props.locale;
        const authorOrder = `${numberToWords(index + 1)} ${suffix.replace('[type]', this.props.type)}`;
        // eg First listed author
        const icon = this.getAuthorItemStatusIcon(linked, selected);
        const disabled = this.props.disabled || linked;

        return (
            <Grid item xs={12} sm={6} md={4}>
                <Button
                    onClick={!linked && !selected ? this._selectAuthor : undefined}
                    fullWidth
                    disabled={disabled}
                    className={this.props.classes.buttonBase}
                    startIcon={icon}
                    children={
                        <Typography
                            variant="button"
                            id={`${this.props.authorItemId}-name`}
                            data-testid={`${this.props.authorItemId}-name`}
                            align="left"
                        >
                            {author[`rek_${this.props.type}`]}
                        </Typography>
                    }
                    id={`${this.props.authorItemId}`}
                    data-analyticsid={`${this.props.authorItemId}`}
                    data-testid={`${this.props.authorItemId}`}
                />
                <Typography
                    variant="caption"
                    className={this.props.classes.authorOrder}
                    id={`${this.props.authorItemId}-order`}
                    data-testid={`${this.props.authorItemId}-order`}
                >
                    {authorOrder}
                </Typography>
            </Grid>
        );
    }
}

export default withStyles(styles)(AuthorItem);
