import MockAdapter from 'axios-mock-adapter';

export {};

declare global {
    // testing helper
    let mockApi: MockAdapter;
    let mockSessionApi: MockAdapter;
}
