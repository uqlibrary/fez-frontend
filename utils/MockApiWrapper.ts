/* eslint-disable space-before-function-paren */
/* eslint-disable no-use-before-define */
import { clearLastRequest } from '../src/config/axios';
import * as repositories from '../src/repositories';
import MockAdapter from 'axios-mock-adapter';

interface Params {
    status?: number;
    pid?: string;
    data?: Record<string, unknown>;
    once?: boolean;
}

interface CvoParams {
    status?: number;
    cvoId?: number;
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
    cvo: {
        get: (cvoId: number) => string;
    };
}

interface RecordApi {
    create: (params: Params) => RecordApi;
    get: (params: Params) => RecordApi;
    update: (params: Params) => RecordApi;
    delete: (params: Params) => RecordApi;
    issues: (params: Params) => RecordApi;
    files: DatastreamApi;
    cvo: ControlledVocabApi;
    instance: MockAdapter;
}

interface DatastreamApi {
    presignedUrl: (params: Params) => DatastreamApi;
    put: (params: Params) => DatastreamApi;
    upload: (attributes?: Params, defaults?: Params) => DatastreamApi;
    records: RecordApi;
    cvo: ControlledVocabApi;
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
        files: DatastreamApi;
        cvo: ControlledVocabApi;
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
const wrapper: Api = {
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
        cvo: {
            get: (cvoId: number) => repositories.routes.VOCABULARIES_API({ id: cvoId }).apiUrl,
        },
    },
    mock: {
        instance: mockApi,
        records: {
            create: function({ status = 200, pid = '', data = {}, once = true }: Params) {
                this.instance.onPost(wrapper.url.records.create)[replyMethod(once)](status, {
                    data: { rek_pid: pid, ...data },
                });
                return this;
            },
            get: function({ status = 200, pid = '', data = {}, once = true }: Params) {
                this.instance.onGet(wrapper.url.records.get(pid))[replyMethod(once)](status, {
                    data: { rek_pid: pid, ...data },
                });
                return this;
            },
            update: function({ status = 200, pid = '', data = {}, once = true }: Params) {
                this.instance.onPatch(wrapper.url.records.get(pid))[replyMethod(once)](status, {
                    data: { rek_pid: pid, ...data },
                });
                return this;
            },
            delete: function({ status = 200, pid = '', once = true }: Params) {
                this.instance.onDelete(wrapper.url.records.get(pid))[replyMethod(once)](status, {
                    data: 'Record deleted',
                });
                return this;
            },
            issues: function({ status = 200, pid = '', data = {}, once = true }: Params) {
                this.instance.onPost(wrapper.url.records.issues(pid))[replyMethod(once)](status, { data });
                return this;
            },
            files: {} as DatastreamApi,
            cvo: {} as ControlledVocabApi,
            instance: {} as MockAdapter,
        },
        files: {
            presignedUrl: function({ status = 200, once = true }: Params) {
                this.instance.onPost(wrapper.url.files.presignedUrl)[replyMethod(once)](status, wrapper.url.files.put);
                return this;
            },
            put: function({ status = 200, once = true }: Params) {
                this.instance.onPut(wrapper.url.files.put)[replyMethod(once)](status);
                return this;
            },
            upload: function(params: Params = {}, defaults: Params = { status: 200, once: true }) {
                return this.presignedUrl({ ...defaults, ...params }).put({ ...defaults, ...params });
            },
            records: {} as RecordApi,
            cvo: {} as ControlledVocabApi,
            instance: {} as MockAdapter,
        },
        cvo: {
            get: function({ status = 200, cvoId = 0, data = {}, once = false }: CvoParams) {
                this.instance.onGet(wrapper.url.cvo.get(cvoId))[replyMethod(once)](status, { data });
                return this;
            },
            records: {} as RecordApi,
            files: {} as DatastreamApi,
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

// cross-references to allow chaining
wrapper.mock.records.files = wrapper.mock.files as DatastreamApi;
wrapper.mock.records.cvo = wrapper.mock.cvo as ControlledVocabApi;
wrapper.mock.records.instance = wrapper.mock.instance as MockAdapter;
wrapper.mock.files.records = wrapper.mock.records as RecordApi;
wrapper.mock.files.cvo = wrapper.mock.cvo as ControlledVocabApi;
wrapper.mock.files.instance = wrapper.mock.instance as MockAdapter;
wrapper.mock.cvo.records = wrapper.mock.records as RecordApi;
wrapper.mock.cvo.files = wrapper.mock.files as DatastreamApi;
wrapper.mock.cvo.instance = wrapper.mock.instance as MockAdapter;

export default wrapper;
