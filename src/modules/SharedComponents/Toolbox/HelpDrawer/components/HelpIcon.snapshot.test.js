jest.dontMock('./HelpIcon');

import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import HelpIcon from './HelpIcon';

function setup(title, text, buttonLabel) {
    const props = {
        title: title,
        text: text,
        buttonLabel: buttonLabel
    };

    return shallow(<HelpIcon {...props} inline />);
}

describe('HelpIcon snapshots tests', () => {
    it('renders menu', () => {
        const hdText = 'Integer mattis rutrum velit nec posuere. Quisque rhoncus quam elit, eu tincidunt diam feugiat eu. Quisque luctus luctus mauris faucibus ornare. Ut eu metus vitae est euismod gravida ac vel augue. Duis sapien massa, tempor id vulputate nec, auctor nec augue. Donec ullamcorper dignissim metus at vulputate. Mauris non magna enim. Quisque gravida libero augue, efficitur vestibulum leo porttitor id. Etiam quis nisi vehicula, eleifend turpis ut, accumsan nisi. Nam nec nibh auctor, placerat ex vel, rhoncus risus. In fermentum ex sit amet augue molestie sodales. Sed eleifend convallis dui id euismod. Nam eu turpis non mi facilisis euismod. Morbi congue et lectus sed tempus. Interdum et malesuada fames ac ante ipsum primis in faucibus.';

        const wrapper = setup('HelpDrawer Title', hdText, 'Close');
        const tree = toJson(wrapper);
        expect(tree).toMatchSnapshot();
    });
});
