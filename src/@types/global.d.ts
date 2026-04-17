import MockAdapter from 'axios-mock-adapter';

export {};

declare global {
    // testing helper
    let mockApi: MockAdapter;
    let mockSessionApi: MockAdapter;
    // debug helpers
    let dd: (obj: any) => void;
    let dc: (...args: any[]) => void;
    let dr: <T = any>(arg: T) => T;
    let dj: (...args: any[]) => void;
}
