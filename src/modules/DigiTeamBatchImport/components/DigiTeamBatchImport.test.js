import { DigiTeamBatchImport } from './DigiTeamBatchImport';

function setup(testProps, isShallow = true) {
    const props = {};
    return getElement(DigiTeamBatchImport, props, isShallow);
}

describe('Component DigiTeamBatchImport', () => {
    it('renders page', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
