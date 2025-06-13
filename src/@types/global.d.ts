import MockAdapter from 'axios-mock-adapter';

export {};

declare global {
    let mockApi: MockAdapter;
    let mockSessionApi: MockAdapter;
}
