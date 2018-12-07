import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {withStyles} from '@material-ui/core/styles';
import RadioButtonUnchecked from '@material-ui/icons/RadioButtonUnchecked';
import RadioButtonChecked from '@material-ui/icons/RadioButtonChecked';
import Link from '@material-ui/icons/Link';
const converter = require('number-to-words');

const styles = (theme) => ({
    authorLinkIcon: {
        marginRight: theme.spacing.unit
    },
    buttonBase: {
        justifyContent: 'flex-start'
    },
    authorOrder: {
        marginLeft: theme.spacing.unit * 6,
        marginBottom: theme.spacing.unit * 2
    }
});

export class AuthorItem extends PureComponent {
    static propTypes = {
        type: PropTypes.string,
        linked: PropTypes.bool,
        selected: PropTypes.bool,
        disabled: PropTypes.bool,
        author: PropTypes.object,
        onAuthorSelected: PropTypes.func,
        locale: PropTypes.object,
        index: PropTypes.number,
        classes: PropTypes.object
    };

    static defaultProps = {
        locale: {
            suffix: ' listed [type]'
        }
    };

    /**
     * On author selected
     *
     * @private
     */
    _selectAuthor = () => {
        if (this.props.onAuthorSelected) this.props.onAuthorSelected(this.props.author);
    };

    _ucfirst = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

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
            return <RadioButtonChecked className={this.props.classes.authorLinkIcon} color="primary"/>;
        }
    };

    render() {
        const {linked, author, selected, index} = this.props;
        const {suffix} = this.props.locale;
        const authorOrder = this._ucfirst(converter.toWordsOrdinal((index + 1))) + ' ' + suffix.replace('[type]', this.props.type);
        const icon = this.getAuthorItemStatusIcon(linked, selected);
        const disabled = this.props.disabled || linked;

        return (
            <Grid item xs={12} sm={6} md={4}>
                <Grid container>
                    <Grid item xs={12}>
                        <Button
                            onClick={(!linked && !selected) ? this._selectAuthor : undefined}
                            fullWidth
                            disabled={disabled}
                            className={this.props.classes.buttonBase}
                        >
                            {icon}
                            {author[`rek_${this.props.type}`]}
                        </Button>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="caption" className={this.props.classes.authorOrder}>{authorOrder}</Typography>
                    </Grid>
                </Grid>
            </Grid>
        );
    }
}

export default withStyles(styles)(AuthorItem);
