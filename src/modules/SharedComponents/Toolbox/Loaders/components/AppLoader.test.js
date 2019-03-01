import {styles} from './AppLoader';

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
                        }
                    }
                },
                white: {
                    main: 'test4'
                }
            },
            typography: {
                fontWeightLight: 'test5'
            }
        };
        const result = {
            appLoader: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                test1: 'test1',
                test2: 'test2',
                test3: 'test3',
                width: '100%',
                height: '100%',
                textAlign: 'center !important'
            },
            white: {
                color: 'test4',
                fontWeight: 'test5'
            },
            spaceBetween: {
                margin: '16px 0'
            },
            logo: {
                width: 200
            }
        };
        expect(styles(theme)).toMatchObject(result);

        delete theme.palette.primary;
        delete result.appLoader.test1;
        delete result.appLoader.test2;
        delete result.appLoader.test3;
        expect(styles(theme)).toMatchObject(result);

        delete theme.palette;
        delete result.white.color;
        expect(styles(theme)).toMatchObject(result);

        delete theme.typography;
        delete result.white.fontWeight;
        expect(styles(theme)).toMatchObject(result);

    });
});