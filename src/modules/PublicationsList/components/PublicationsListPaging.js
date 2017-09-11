import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {locale} from 'config';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
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
    }

    render() {
        const txt = locale.components.paging;
        const totalPages = Math.ceil(this.state.total / this.state.per_page);
        if (totalPages === 0) return (<span className="publicationsListPaging empty"/>);
        const renderedPages = Array(totalPages).fill()
            .map((page, index) => {
                return (
                    <FlatButton
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
                <div className="publicationsListControls columns is-gapless is-mobile">
                    <div className="column"/>
                    {this.state.current_page > 0 &&
                    <div className="column is-narrow">
                        <IconButton tooltip={txt.previousPage}
                            tooltipPosition="top-left"
                            className="iconPrevious"
                            onTouchTap={() => {
                                this.pageChanged(this.state.current_page - 1);
                            }}
                            disabled={this.props.disabled || this.state.current_page === 1}
                        >
                            <NavigationChevronLeft/>
                        </IconButton>
                    </div>
                    }
                    <div className="column is-narrow">
                        <FlatButton
                            className="pagingLabel"
                            label={txt.pageOf.replace('[currentPage]', this.state.current_page).replace('[totalPages]', totalPages) + ' ' + txt.totalRecords.replace('[total]', this.state.total)}/>
                    </div>
                    {this.state.current_page <= totalPages &&
                    <div className="column is-narrow">
                        <IconButton tooltip={txt.nextPage}
                            tooltipPosition="top-right"
                            className="iconNext"
                            onTouchTap={() => {
                                this.pageChanged(this.state.current_page + 1);
                            }}
                            disabled={this.props.disabled || this.state.current_page === totalPages}
                        >
                            <NavigationChevronRight/>
                        </IconButton>
                    </div>
                    }
                    <div className="column"/>
                </div>
                {totalPages > 1 &&
                <div className="publicationsListPaging columns is-multiline is-gapless">
                    <FlatButton
                        className="pagingPrevious"
                        onTouchTap={() => {
                            this.pageChanged(this.state.current_page - 1);
                        }}
                        disabled={this.props.disabled || this.state.current_page === 1}
                        label={txt.previousPage}/>
                    {renderedPages}
                    <FlatButton
                        className="pagingNext"
                        onTouchTap={() => {
                            this.pageChanged(this.state.current_page + 1);
                        }}
                        disabled={this.props.disabled || this.state.current_page === totalPages}
                        label={txt.nextPage}/>
                </div>
                }
            </div>
        );
    }
}
