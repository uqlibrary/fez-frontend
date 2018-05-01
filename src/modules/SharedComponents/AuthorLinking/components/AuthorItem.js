import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import FlatButton from 'material-ui/FlatButton';
import Link from 'material-ui/svg-icons/content/link';
import RadioButtonUnchecked from 'material-ui/svg-icons/toggle/radio-button-unchecked';
import RadioButtonChecked from 'material-ui/svg-icons/toggle/radio-button-checked';

export default class AuthorItem extends PureComponent {
    static propTypes = {
        type: PropTypes.string,
        linked: PropTypes.bool,
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
            suffix: ' listed [type]'
        }
    };

    constructor(props) {
        super(props);
    }

    /**
     * On author selected
     *
     * @private
     */
    _selectAuthor = () => {
        if (this.props.onAuthorSelected) this.props.onAuthorSelected(this.props.author);
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
            return <RadioButtonUnchecked className="author-link-status" />;
        } else if (linked) {
            return <Link className="author-link-status" />;
        } else {
            return <RadioButtonChecked className="author-link-status" />;
        }
    };

    getAuthorName = (author) => {
        return (
            <span className="author-link-name">
                {author[`rek_${this.props.type}`]}
            </span>
        );
    };

    render() {
        const {linked, author, selected, index} = this.props;
        const {ordinalData, suffix} = this.props.locale;
        const authorOrder = (index < ordinalData.length ? ordinalData[index] : (index + 1)) + ' ' + suffix.replace('[type]', this.props.type);
        const icon = this.getAuthorItemStatusIcon(linked, selected);
        const disabled = this.props.disabled || linked;
        const authorName = this.getAuthorName(author);

        return (
            <div className="column is-one-third-desktop is-one-third-tablet is-full-mobile">
                <div className="authorButton">
                    <FlatButton
                        label={authorName}
                        onClick={(!linked && !selected) ? this._selectAuthor : undefined}
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
