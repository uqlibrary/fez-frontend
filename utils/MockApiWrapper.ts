/* eslint-disable space-before-function-paren */
/* eslint-disable no-use-before-define */
import { clearLastRequest } from '../src/config/axios';
import * as repositories from '../src/repositories';
import MockAdapter from 'axios-mock-adapter';

interface Params {
    status?: number;
    data?: Record<string | number, unknown>;
    once?: boolean;
}

interface RecordParams extends Params {
    pid?: string;
}

interface JournalParams extends Params {
    id?: string;
}

interface CvoParams extends Params {
    cvoId?: number;
}

interface ApiUrls {
    records: {
        create: string;
        update: (pid: string, isEdit?: boolean) => string;
        get: (pid: string, isEdit?: boolean) => string;
        issues: (pid: string) => string;
    };
    journals: {
        get: (id: string, isEdit?: boolean) => RegExp;
    };
    files: {
        presignedUrl: string;
        put: string;
    };
    cvo: {
        get: (cvoId: number) => string;
    };
}

interface DatastreamApi {
    presignedUrl: (params?: Params) => DatastreamApi;
    put: (params?: Params) => DatastreamApi;
    upload: (attributes?: Params, defaults?: Params) => DatastreamApi;
    fail: {
        upload: () => DatastreamApi;
    };
    records: RecordApi;
    cvo: ControlledVocabApi;
    instance: MockAdapter;
}

interface RecordApi {
    create: (params?: RecordParams) => RecordApi;
    get: (params?: RecordParams) => RecordApi;
    update: (params?: RecordParams) => RecordApi;
    bulkUpdate: (params?: RecordParams) => RecordApi;
    delete: (params?: RecordParams) => RecordApi;
    issues: (params?: RecordParams) => RecordApi;
    fail: {
        create: () => RecordApi;
        get: (params?: RecordParams) => RecordApi;
        update: (params?: RecordParams) => RecordApi;
        bulkUpdate: (params?: RecordParams) => RecordApi;
    };
    files: DatastreamApi;
    cvo: ControlledVocabApi;
    instance: MockAdapter;
}

interface JournalApi {
    get: (params?: JournalParams) => JournalApi;
    instance: MockAdapter;
}

interface ControlledVocabApi {
    get: (params: CvoParams) => ControlledVocabApi;
    records: RecordApi;
    files: DatastreamApi;
    instance: MockAdapter;
}

interface Api {
    url: ApiUrls;
    mock: {
        instance: MockAdapter;
        records: RecordApi;
        journals: JournalApi;
        files: DatastreamApi;
        cvo: ControlledVocabApi;
        reset: () => void;
    };
    request: {
        history: {
            reset: () => void;
        };
    };
    reset: () => void;
}

const replyMethod = (once: boolean): 'reply' | 'replyOnce' => (once ? 'replyOnce' : 'reply');

/**
 * This is an `mockApi` (Axios Mock Adapter instance) wrapper, for improved DX when mocking API requests.
 */
export const api: Api = {
    url: {
        records: {
            create: repositories.routes.NEW_RECORD_API().apiUrl,
            update: (pid: string, isEdit: boolean = false) => api.url.records.get(pid, isEdit),
            get: (pid: string, isEdit: boolean = false) =>
                repositories.routes.EXISTING_RECORD_API({ pid, isEdit }).apiUrl,
            issues: (pid: string) => repositories.routes.RECORDS_ISSUES_API({ pid }).apiUrl,
        },
        journals: {
            get: (id: string, isEdit: boolean = false) =>
                new RegExp(repositories.routes.JOURNAL_API({ id, isEdit }).apiUrl),
        },
        files: {
            presignedUrl: repositories.routes.FILE_UPLOAD_API().apiUrl,
            put: 's3-ap-southeast-2.amazonaws.com',
        },
        cvo: {
            get: (cvoId: number) => repositories.routes.VOCABULARIES_API({ id: cvoId }).apiUrl,
        },
    },
    mock: {
        instance: mockApi,
        records: {
            create: function ({ status = 200, pid = '', data = {}, once = true }: RecordParams = {}) {
                this.instance.onPost(api.url.records.create)[replyMethod(once)](status, {
                    data: { rek_pid: pid, ...data },
                });
                return this;
            },
            get: function ({ status = 200, pid = '', data = {}, once = true }: RecordParams = {}) {
                this.instance.onGet(api.url.records.get(pid))[replyMethod(once)](status, {
                    data: { rek_pid: pid, ...data },
                });
                return this;
            },
            update: function ({ status = 200, pid = '', data = {}, once = true }: RecordParams = {}) {
                this.instance.onPatch(api.url.records.get(pid))[replyMethod(once)](status, {
                    data: { rek_pid: pid, ...data },
                });
                return this;
            },
            bulkUpdate: function ({ status = 200, data = {}, once = true }: RecordParams = {}) {
                this.instance.onPatch(api.url.records.create)[replyMethod(once)](status, { data });
                return this;
            },
            delete: function ({ status = 200, pid = '', once = true }: RecordParams = {}) {
                this.instance.onDelete(api.url.records.get(pid))[replyMethod(once)](status, {
                    data: 'Record deleted',
                });
                return this;
            },
            issues: function ({ status = 200, pid = '', data = {}, once = true }: RecordParams = {}) {
                this.instance.onPost(api.url.records.issues(pid))[replyMethod(once)](status, { data });
                return this;
            },
            fail: {
                create: () => api.mock.records.create({ status: 500 }),
                get: ({ pid = '', once = true }: RecordParams = {}) => api.mock.records.get({ pid, status: 500, once }),
                update: ({ pid = '', data = {}, once = true }: RecordParams = {}) =>
                    api.mock.records.update({ status: 500, pid, data, once }),
                bulkUpdate: ({ data = {}, once = true }: RecordParams = {}) =>
                    api.mock.records.bulkUpdate({ status: 500, data, once }),
            },
            files: {} as DatastreamApi,
            cvo: {} as ControlledVocabApi,
            instance: {} as MockAdapter,
        },
        files: {
            presignedUrl: function ({ status = 200, once = true }: Params = {}) {
                this.instance.onPost(api.url.files.presignedUrl)[replyMethod(once)](status, api.url.files.put);
                return this;
            },
            put: function ({ status = 200, once = true }: Params = {}) {
                this.instance.onPut(api.url.files.put)[replyMethod(once)](status);
                return this;
            },
            upload: function ({ status = 200, once = true }: Params = {}) {
                return this.presignedUrl({ status, once }).put({ status, once });
            },
            fail: {
                upload: () => api.mock.files.presignedUrl({ once: false }).put({ status: 500, once: false }),
            },
            records: {} as RecordApi,
            cvo: {} as ControlledVocabApi,
            instance: {} as MockAdapter,
        },
        cvo: {
            get: function ({ status = 200, cvoId = 0, data = {}, once = false }: CvoParams) {
                this.instance.onGet(api.url.cvo.get(cvoId))[replyMethod(once)](status, { data });
                return this;
            },
            records: {} as RecordApi,
            files: {} as DatastreamApi,
            instance: {} as MockAdapter,
        },
        journals: {
            get: function ({ status = 200, id = '', data = {}, once = true }: JournalParams = {}) {
                this.instance.onGet(api.url.journals.get(id))[replyMethod(once)](status, {
                    data: { jnl_jid: id, ...data },
                });
                return this;
            },
            instance: {} as MockAdapter,
        },
        reset: function () {
            this.instance.resetHandlers();
        },
    },
    request: {
        history: {
            reset: () => clearLastRequest(),
        },
    },
    reset: function () {
        this.mock.reset();
        this.request.history.reset();
    },
};

// cross-references for chaining
api.mock.records.files = api.mock.files as DatastreamApi;
api.mock.records.cvo = api.mock.cvo as ControlledVocabApi;
api.mock.records.instance = api.mock.instance as MockAdapter;
api.mock.files.records = api.mock.records as RecordApi;
api.mock.files.cvo = api.mock.cvo as ControlledVocabApi;
api.mock.files.instance = api.mock.instance as MockAdapter;
api.mock.cvo.records = api.mock.records as RecordApi;
api.mock.cvo.files = api.mock.files as DatastreamApi;
api.mock.cvo.instance = api.mock.instance as MockAdapter;
api.mock.journals.instance = api.mock.instance as MockAdapter;
