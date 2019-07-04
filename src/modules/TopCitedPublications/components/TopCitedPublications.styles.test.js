import { styles } from './TopCitedPublications';

describe('TopCitedPublications component', () => {
    it('should have a proper style generator', () => {
        const theme = {
            breakpoints: {
                up: jest.fn(() => '@media (min-width:600px)'),
                down: jest.fn(() => '@media (max-width:599.95px)'),
            },
            palette: {
                primary: {
                    main: 'test1',
                },
                white: {
                    main: 'test2',
                },
                accent: {
                    main: 'test3',
                },
            },
        };
        const test = styles(theme);
        expect(theme.breakpoints.up).toBeCalled();
        expect(theme.breakpoints.down).toBeCalled();
        expect(test).toMatchSnapshot();
    });
});
