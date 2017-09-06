import React from 'react';
import PropTypes from 'prop-types';
import FlatButton from 'material-ui/FlatButton';
import Link from 'material-ui/svg-icons/content/link';
import RadioButtonUnchecked from 'material-ui/svg-icons/toggle/radio-button-unchecked';
import RadioButtonChecked from 'material-ui/svg-icons/toggle/radio-button-checked';

export default class AuthorItem extends React.Component {
    static propTypes = {
        unlinked: PropTypes.bool,
        selected: PropTypes.bool,
        disabled: PropTypes.bool,
        author: PropTypes.object,
        onAuthorSelected: PropTypes.func,
        locale: PropTypes.object,
        index: PropTypes.number
    };

    static defaultProps = {
        locale: {
            ordinalData: ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth', 'Ninth', 'Tenth'],
            suffix: ' listed author'
        }
    };

    static labelStyle = {
        float: 'left',
        width: '70%'
    };

    constructor(props) {
        super(props);
    }

    /**
     * On author selected
     *
     * @private
     */
    _authorSelect = () => {
        this.props.onAuthorSelected(this.props.author);
    };

    /**
     * Get status icon for an author based on attributes
     *
     * @param unlinked
     * @param selected
     * @returns {XML}
     */
    getAuthorItemStatusIcon = (unlinked, selected) => {
        if (unlinked && !selected) {
            return <RadioButtonUnchecked className="author-link-status" />;
        } else if (!unlinked) {
            return <Link className="author-link-status" />;
        } else {
            return <RadioButtonChecked className="author-link-status" />;
        }
    };

    render() {
        const { unlinked, author, selected } = this.props;
        const {ordinalData} = this.props.locale;
        const authorOrder = (this.props.index < ordinalData.length ? ordinalData[this.props.index] : (this.props.index + 1)) + ' ' + this.props.locale.suffix;
        const icon = this.getAuthorItemStatusIcon(unlinked, selected);
        const disabled = this.props.disabled || !unlinked;

        return (
            <div className="column is-one-quarter-desktop is-one-third-tablet is-full-mobile">
                <div className="authorButton">
                    <FlatButton
                        label={author.rek_author}
                        labelStyle={AuthorItem.labelStyle}
                        onTouchTap={ (unlinked && !selected) ? this._authorSelect : undefined }
                        fullWidth
                        icon={icon}
                        primary={selected}
                        disabled={disabled}
                    />
                    <div className="author-link-order">
                        <span className="author-link-order-text">{authorOrder}</span>
                    </div>
                </div>
            </div>
        );
    }
}
