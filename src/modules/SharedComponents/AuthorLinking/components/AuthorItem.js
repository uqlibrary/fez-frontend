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
        onAuthorSelect: PropTypes.func,
        locale: PropTypes.object,
        index: PropTypes.number
    };

    static defaultProps = {
        unlinked: false,
        selected: false,
        locale: {
            ordinalData: ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth', 'Ninth', 'Tenth'],
            suffix: ' listed author'
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
    _onAuthorSelect = () => {
        this.props.onAuthorSelect(this.props.author);
    };

    render() {
        const { unlinked, author, selected } = this.props;
        const {ordinalData} = this.props.locale;
        const authorOrder = (this.props.index < ordinalData.length ? ordinalData[this.props.index] : (this.props.index + 1)) + ' ' + this.props.locale.suffix;

        return (
            <div className="column is-one-quarter-desktop is-one-third-tablet is-full-mobile">
                <div className="authorButton">
                    {
                        // Enabled flat button for unlinked and not selected author
                        unlinked && !selected &&
                            <FlatButton
                                label={author.rek_author}
                                onTouchTap={ this._onAuthorSelect }
                                fullWidth
                                icon={<RadioButtonUnchecked />}
                                disabled={this.props.disabled}
                            />
                    }
                    {
                        // disabled flat button for linked and not selected author
                        !unlinked && !selected &&
                            <FlatButton
                                label={author.rek_author}
                                disabled
                                fullWidth
                                icon={<Link />}
                            />
                    }
                    {
                        // raised button for selected author
                        selected &&
                            <FlatButton
                                label={author.rek_author}
                                primary
                                fullWidth
                                icon={<RadioButtonChecked />}
                                disabled={this.props.disabled}
                            />
                    }
                    <div className="author-link-order">
                        <span className="author-link-order-text">{authorOrder}</span>
                    </div>
                </div>
            </div>
        );
    }
}
