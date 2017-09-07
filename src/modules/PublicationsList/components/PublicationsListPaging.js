import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {locale} from 'config';
import FlatButton from 'material-ui/FlatButton';

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
        if(!nextProps.disabled && JSON.stringify(nextProps.pagingData) !== JSON.stringify(this.state)) {
            this.setState({ ...nextProps.pagingData });
        }
    }

    pageChanged = (newPage) => {
        if (this.props.onPageChanged) this.props.onPageChanged(newPage);
    }

    render() {
        const txt = locale.components.paging;
        const totalPages = Math.ceil(this.state.total / this.state.per_page);
        const renderedPages = totalPages > 0 ? Array(totalPages).fill()
            .map((page, index) => {
                return (
                    <div key={index} className="column is-1 is-hidden-mobile">
                        <FlatButton
                            onTouchTap={() => {
                                this.pageChanged(index + 1);
                            }}
                            disabled={this.props.disabled || (index + 1) === this.state.current_page}
                            className={'page' + ((index + 1) === this.state.current_page ? ' selectedPage' : '')}
                            label={index + 1}/>
                    </div>
                );
            }) : (<span />);

        return (
            <div className="publicationsListPaging columns is-gapless is-mobile">
                <div className="column is-hidden-mobile">
                    <FlatButton
                        label={txt.pageOf.replace('[currentPage]', this.state.current_page).replace('[totalPages]', totalPages) + ' ' + txt.totalRecords.replace('[total]', this.state.total)} />
                </div>
                {
                    this.state.current_page > 1 &&
                    <div className="column is-half-mobile">
                        <FlatButton
                            className="pagingPrevious"
                            onTouchTap={() => {
                                this.pageChanged(this.state.current_page - 1);
                            }}
                            disabled={this.props.disabled}
                            label={txt.previousPage}/>
                    </div>
                }
                {
                    totalPages > 1 &&
                    renderedPages
                }
                {
                    this.state.current_page < totalPages &&
                    <div className="column is-half-mobile">
                        <FlatButton
                            className="pagingNext"
                            onTouchTap={() => {
                                this.pageChanged(this.state.current_page + 1);
                            }}
                            disabled={this.props.disabled}
                            label={txt.nextPage}/>
                    </div>
                }
            </div>
        );
    }
}
