import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {locale} from 'locale';
import FlatButton from 'material-ui/FlatButton';
import NavigationChevronRight from 'material-ui/svg-icons/navigation/chevron-right';
import NavigationChevronLeft from 'material-ui/svg-icons/navigation/chevron-left';

export default class PublicationsListPaging extends Component {
    static propTypes = {
        onPageChanged: PropTypes.func,
        disabled: PropTypes.bool,
        pagingData: PropTypes.shape({
            from: PropTypes.number,
            to: PropTypes.number,
            total: PropTypes.number,
            per_page: PropTypes.number,
            current_page: PropTypes.number
        })
    };

    constructor(props) {
        super(props);

        // keep local copy of paging data not to render empty paging component when loading a new page or sorting
        this.state = {
            ...this.props.pagingData
        };
    }

    componentWillReceiveProps(nextProps) {
        if (!nextProps.disabled && JSON.stringify(nextProps.pagingData) !== JSON.stringify(this.state)) {
            this.setState({...nextProps.pagingData});
        }
    }

    pageChanged = (newPage) => {
        if (this.props.onPageChanged) this.props.onPageChanged(newPage);
    };

    renderButton = (key) => {
        const currentPage = this.state.current_page;
        const totalPages = this.state.total && this.state.per_page ? Math.ceil(this.state.total / this.state.per_page) : 0;
        return (
            <FlatButton
                key={key}
                onClick={() => {this.pageChanged(key);}}
                disabled={this.props.disabled || (key) === currentPage}
                className={'page' + ((key) === currentPage ? ' selectedPage' : '')}
                aria-label={locale.components.paging.pageButtonAriaLabel
                    .replace('[pageNumber]', key)
                    .replace('[totalPages]', totalPages)}
                label={key}
            />
        );
    };

    renderPageButtons = () => {
        const totalPages = this.state.total && this.state.per_page ? Math.ceil(this.state.total / this.state.per_page) : 0;
        const pageBracket = locale.components.paging.pagingBracket;
        const currentPage = this.state.current_page;
        const startPage = (currentPage - pageBracket < 1) ? 1 : currentPage - pageBracket;
        const endPage = (currentPage + pageBracket > totalPages) ? totalPages : (currentPage + pageBracket);
        const totalToRender = endPage - startPage + 1;
        return Array(totalToRender).fill().map((page, index) => {
            return this.renderButton(index + startPage);
        });
    };

    render() {
        const txt = locale.components.paging;
        const totalPages = this.state.total && this.state.per_page ? Math.ceil(this.state.total / this.state.per_page) : 0;
        const currentPage = this.state.current_page;
        if (totalPages === 0 || this.state.current_page < 1 || this.state.current_page > totalPages) {
            return (<span className="publicationsListControls empty"/>);
        }
        return (
            <div>
                {
                    totalPages > 1 &&
                    <div className="publicationsListPaging is-gapless columns is-gapless is-mobile">
                        {
                            currentPage >= 1 &&
                                <div className="column is-narrow is-pulled-left">
                                    <FlatButton
                                        className="pagingPrevious"
                                        onClick={() => {
                                            this.pageChanged(currentPage - 1);
                                        }}
                                        disabled={this.props.disabled || currentPage === 1}
                                        label={txt.previousPage}
                                        labelPosition="after"
                                        icon={<NavigationChevronLeft/>}/>
                                </div>
                        }
                        <div className="publicationsListPagingItems column is-hidden-mobile has-text-centered">
                            {(currentPage - (txt.pagingBracket + 1) >= 1) && this.renderButton(1)}
                            {(currentPage - (txt.pagingBracket + 2) >= 1) && txt.firstLastSeparator}
                            {this.renderPageButtons()}
                            {(currentPage + (txt.pagingBracket + 2) <= totalPages) && txt.firstLastSeparator}
                            {(currentPage + (txt.pagingBracket + 1) <= totalPages) && this.renderButton(totalPages)}
                        </div>
                        <div className="column is-hidden-tablet-only is-hidden-desktop has-text-centered">
                            <FlatButton className="pagingTotals"
                                label={txt.pageOf
                                    .replace('[currentPage]', currentPage)
                                    .replace('[totalPages]', totalPages)
                                }/>
                        </div>
                        {
                            currentPage <= totalPages &&
                            <div className="column is-narrow is-pulled-right">
                                <FlatButton
                                    className="pagingNext"
                                    onClick={() => {
                                        this.pageChanged(currentPage + 1);
                                    }}
                                    disabled={this.props.disabled || currentPage === totalPages}
                                    label={txt.nextPage}
                                    labelPosition="before"
                                    icon={<NavigationChevronRight/>}/>
                            </div>
                        }
                    </div>
                }
            </div>
        );
    }
}
