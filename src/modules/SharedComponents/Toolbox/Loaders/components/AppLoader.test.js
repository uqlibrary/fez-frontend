import { styles } from './AppLoader';

describe('AppLoader component', () => {
    it('should have a proper style generator', () => {
        const theme = {
            palette: {
                primary: {
                    gradient: {
                        diagonal: {
                            test1: 'test1',
                            test2: 'test2',
                            test3: 'test3',
                        },
                    },
                },
                white: {
                    main: 'test4',
                },
            },
            typography: {
                fontWeightLight: 'test5',
            },
        };
        expect(styles(theme)).toMatchSnapshot();

        delete theme.palette.primary;
        expect(styles(theme)).toMatchSnapshot();

        delete theme.palette;
        expect(styles(theme)).toMatchSnapshot();

        delete theme.typography;
        expect(styles(theme)).toMatchSnapshot();
    });
});
