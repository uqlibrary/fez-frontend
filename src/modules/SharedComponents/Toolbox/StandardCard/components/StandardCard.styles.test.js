import { styles } from './StandardCard';

describe('AppLoader component', () => {
    it('should have a proper style generator', () => {
        const theme = {
            typography: {
                fontWeightRegular: 'test1',
            },
            palette: {
                white: {
                    main: 'test2',
                },
                primary: {
                    main: 'test3',
                },
                accent: {
                    main: 'test4',
                },
            },
        };
        expect(styles(theme)).toMatchSnapshot();
    });
});
