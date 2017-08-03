import React from 'react';
import PropTypes from 'prop-types';

const DashboardAuthorDetails = ({values}) => {
    return (
        <div className="authorDetails">
                {/* Title and name */}
                <div className="authorTitleName title is-3 color-reverse">
                    {values.title}&nbsp;{values.givenName}&nbsp;{values.familyName}
                </div>
                {/* Author Name/Positions/OrgUnits */}
                <div className="is-paddingless is-marginless is-narrow">
                    {
                        values.positions && values.positions.length > 0 && values.positions.map((item, index) => (
                        <div key={index} className="authorPositionOrg color-reverse">
                            <strong>{item}</strong>
                            {
                                values.orgUnits && values.orgUnits.length > 0 && values.orgUnits[index] &&
                                <span className="color-reverse">, {values.orgUnits[index]}</span>
                            }
                        </div>
                    ))
                    }

                </div>
            </div>
    );
};

DashboardAuthorDetails.propTypes = {
    values: PropTypes.shape({
        title: PropTypes.any,
        familyName: PropTypes.any,
        givenName: PropTypes.any,
        orgUnits: PropTypes.any,
        positions: PropTypes.any
    })
};

export default DashboardAuthorDetails;
