import AuthorsPublicationTypesCountChart from './AuthorsPublicationTypesCountChart';

function setup(testProps, isShallow = true) {
    const props = {...testProps};
    return getElement(AuthorsPublicationTypesCountChart, props, isShallow);
}

describe('AuthorsPublicationTypesCountChart ', () => {
    it('should render empty chart component', () => {
        const app = setup({series: []});
        expect(toJson(app)).toMatchSnapshot();
    });
});

