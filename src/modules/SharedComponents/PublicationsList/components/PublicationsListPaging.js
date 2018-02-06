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

    render() {
        const txt = locale.components.paging;
        const totalPages = this.state.total && this.state.per_page ? Math.ceil(this.state.total / this.state.per_page) : 0;
        if (totalPages === 0) return (<span className="publicationsListControls empty"/>);
        const renderedPages = Array(totalPages).fill()
            .map((page, index) => {
                return (
                    <FlatButton
                        key={index}
                        onTouchTap={() => {
                            this.pageChanged(index + 1);
                        }}
                        disabled={this.props.disabled || (index + 1) === this.state.current_page}
                        className={'page' + ((index + 1) === this.state.current_page ? ' selectedPage' : '')}
                        label={index + 1}/>
                );
            });

        return (
            <div>
                {
                    totalPages > 1 &&
                    <div className="publicationsListPaging is-gapless is-hidden-mobile is-hidden-tablet-only">
                        {
                            this.state.current_page >= 1 &&
                            <FlatButton
                                className="pagingPrevious"
                                onTouchTap={() => {
                                    this.pageChanged(this.state.current_page - 1);
                                }}
                                disabled={this.props.disabled || this.state.current_page === 1}
                                label={txt.previousPage}
                                labelPosition="after"
                                icon={<NavigationChevronLeft/>}/>
                        }
                        <div className="publicationsListPagingItems">
                            {renderedPages}
                        </div>
                        {
                            this.state.current_page <= totalPages &&
                            <FlatButton
                                className="pagingNext"
                                onTouchTap={() => {
                                    this.pageChanged(this.state.current_page + 1);
                                }}
                                disabled={this.props.disabled || this.state.current_page === totalPages}
                                label={txt.nextPage}
                                labelPosition="before"
                                icon={<NavigationChevronRight/>}/>
                        }
                    </div>
                }
            </div>
        );
    }
}
