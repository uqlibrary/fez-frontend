import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

export default class DashboardAuthorDetails extends PureComponent {
    static propTypes = {
        title: PropTypes.string,
        familyName: PropTypes.string,
        givenName: PropTypes.string,
        orgUnits: PropTypes.array,
        positions: PropTypes.array
    };

    constructor(props) {
        super(props);
    }

    isCasualPosition(position) {
        return position.indexOf('Casual ') > -1;
    }

    /**
     * Hide roles that include the word 'Casual', where multiple roles are currently displayed,
     * and at least one does not include the word 'Casual'
     * If all appointments include the word 'Casual' we will need to display all roles.
     */
    areAllCasualPositions(positions) {
        if (!positions || positions.length === 0) {
            return false;
        }

        return positions.filter((position) => {
            return this.isCasualPosition(position);
        }).length === positions.length;
    }

    render() {
        const areAllCasualPositions = this.areAllCasualPositions(this.props.positions);

        return (
            <div className="authorDetails">
                {/* Title and name */}
                <div className="authorTitleName">
                    {this.props.title}&nbsp;{this.props.givenName}&nbsp;{this.props.familyName}
                </div>
                {/* Author Name/Positions/OrgUnits */}
                <div className="is-paddingless is-marginless is-narrow">
                    {
                        this.props.positions && this.props.positions.length > 0 && this.props.positions.map((item, index) => (
                            ((!areAllCasualPositions && !this.isCasualPosition(item)) || areAllCasualPositions) &&
                            <div key={index} className="authorPositionOrg">
                                <strong>{item}</strong>
                                {
                                    this.props.orgUnits && this.props.orgUnits.length > 0 && this.props.orgUnits[index] &&
                                    <span className="color-reverse">, {this.props.orgUnits[index]}</span>
                                }
                            </div>))
                    }
                </div>
            </div>
        );
    }
}
