import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import locale from 'locale/pages';

export default class DashboardArticleCount extends PureComponent {
    static propTypes = {
        articleCount: PropTypes.number,
        articleFirstYear: PropTypes.string,
        articleLastYear: PropTypes.string
    };

    constructor(props) {
        super(props);
    }

    render() {
        const txt = locale.pages.dashboard.header.dashboardArticleCount;
        return (
            <div className="authorCounter is-centered">
                {
                    this.props.articleCount && this.props.articleFirstYear && this.props.articleLastYear &&
                    <div>
                        <div className="noOfArticles">{this.props.articleCount}</div>
                        <div className="articlesFrom">{txt.countTitle}</div>
                        <div
                            className="dateRange">{this.props.articleFirstYear}<span>{txt.yearSeparator}</span>{this.props.articleLastYear}
                        </div>
                    </div>
                }
            </div>
        );
    }
}
