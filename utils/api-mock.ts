import { clearLastRequest } from '../src/config/axios';
import * as repositories from '../src/repositories';
import MockAdapter from 'axios-mock-adapter';

interface Params {
    status?: number;
    pid?: string;
    data?: Record<string, unknown>;
    once?: boolean;
}

interface ApiUrls {
    records: {
        create: string;
        get: (pid: string, isEdit?: boolean) => string;
        issues: (pid: string) => string;
    };
    files: {
        presignedUrl: string;
        put: string;
    };
}

interface DatastreamApi {
    presignedUrl: (params: Params) => DatastreamApi;
    put: (params: Params) => DatastreamApi;
    upload: (attributes?: Params, defaults?: Params) => DatastreamApi;
    fail: {
        upload: () => DatastreamApi;
    };
    records: RecordApi;
    instance: MockAdapter;
}

interface RecordApi {
    create: (params: Params) => RecordApi;
    get: (params: Params) => RecordApi;
    update: (params: Params) => RecordApi;
    delete: (params: Params) => RecordApi;
    issues: (params: Params) => RecordApi;
    files: DatastreamApi;
    instance: MockAdapter;
}

interface Api {
    url: ApiUrls;
    mock: {
        instance: MockAdapter;
        records: RecordApi;
        files: DatastreamApi;
        reset: () => void;
    };
    request: {
        history: {
            reset: () => void;
        };
    };
}

const replyMethod = (once: boolean): 'reply' | 'replyOnce' => (once ? 'replyOnce' : 'reply');

/**
 * This is an `mockApi` (Axios Mock Adapter instance) wrapper, for improved DX when mocking API requests.
 */
export const api: Api = {
    url: {
        records: {
            create: repositories.routes.NEW_RECORD_API().apiUrl,
            get: (pid: string, isEdit: boolean = false) =>
                repositories.routes.EXISTING_RECORD_API({ pid, isEdit }).apiUrl,
            issues: (pid: string) => repositories.routes.RECORDS_ISSUES_API({ pid }).apiUrl,
        },
        files: {
            presignedUrl: repositories.routes.FILE_UPLOAD_API().apiUrl,
            put: 's3-ap-southeast-2.amazonaws.com',
        },
    },
    mock: {
        instance: mockApi,
        records: {
            create: function({ status = 200, pid = '', data = {}, once = true }: Params) {
                this.instance.onPost(api.url.records.create)[replyMethod(once)](status, {
                    data: { rek_pid: pid, ...data },
                });
                return this;
            },
            get: function({ status = 200, pid = '', data = {}, once = true }: Params) {
                this.instance.onGet(api.url.records.get(pid))[replyMethod(once)](status, {
                    data: { rek_pid: pid, ...data },
                });
                return this;
            },
            update: function({ status = 200, pid = '', data = {}, once = true }: Params) {
                this.instance.onPatch(api.url.records.get(pid))[replyMethod(once)](status, {
                    data: { rek_pid: pid, ...data },
                });
                return this;
            },
            delete: function({ status = 200, pid = '', once = true }: Params) {
                this.instance.onDelete(api.url.records.get(pid))[replyMethod(once)](status, {
                    data: 'Record deleted',
                });
                return this;
            },
            issues: function({ status = 200, pid = '', data = {}, once = true }: Params) {
                this.instance.onPost(api.url.records.issues(pid))[replyMethod(once)](status, { data });
                return this;
            },
            files: {} as DatastreamApi,
            instance: {} as MockAdapter,
        },
        files: {
            presignedUrl: function({ status = 200, once = true }: Params) {
                this.instance.onPost(api.url.files.presignedUrl)[replyMethod(once)](status, api.url.files.put);
                return this;
            },
            put: function({ status = 200, once = true }: Params) {
                this.instance.onPut(api.url.files.put)[replyMethod(once)](status);
                return this;
            },
            upload: function(params: Params = {}, defaults: Params = { status: 200, once: true }) {
                return this.presignedUrl({ ...defaults, ...params }).put({ ...defaults, ...params });
            },
            fail: {
                upload: () => api.mock.files.presignedUrl({ once: false }).put({ status: 500, once: false }),
            },
            records: {} as RecordApi,
            instance: {} as MockAdapter,
        },
        reset: function() {
            this.instance.resetHandlers();
        },
    },
    request: {
        history: {
            reset: () => clearLastRequest(),
        },
    },
};

// cross-references for chaining
api.mock.records.files = api.mock.files as DatastreamApi;
api.mock.records.instance = api.mock.instance as MockAdapter;
api.mock.files.records = api.mock.records as RecordApi;
api.mock.files.instance = api.mock.instance as MockAdapter;
