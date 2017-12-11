import MockAdapter from 'axios-mock-adapter';
import {api} from 'config';
import * as actions from './actionTypes';
import * as repositories from 'repositories';
import {getMockStore, expectStoreHasExpectedActions} from './actions-test-commons';

import * as accountActions from './account';

const store = getMockStore();

describe('Account actions', () => {
    let mock;

    beforeEach(() => {
        mock = new MockAdapter(api, {delayResponse: 100});
    });

    afterEach(() => {
        mock.reset();
        store.clearActions();
    });

    const accountApiData = {
            "id": "uqmbrow1",
            "class": [
                "Campus-STLUCIA",
                "Campus-MATERHOSP",
                "IS_CURRENT",
                "IS_UQ_STAFF_PLACEMENT",
                "IS_ACADEMIC",
                "IS_PAID",
                "IS_FIXED_TERM",
                "IS_TEACHING_AND_RESEARCH",
                "IS_SUBSTANTIVE",
                "IS_UNPAID",
                "staff@uq.edu.au",
                "uqmbrow1@uq.edu.au",
                "Faculty of Science",
                "Mater Research Institute-UQ",
                "Faculty of Medicine"
            ],
            "type": 3,
            "homeLib": "St Lucia",
            "firstName": "Melissa",
            "lastName": "BROWN",
            "name": "Melissa BROWN",
            "mail": "melissa.brown@uq.edu.au",
            "barcode": "24067520110074",
            "groups": [
                "CN=Sci Faculty - Office of the Executive Dean,OU=Faculty Office,OU=SCI-Mail Enabled Groups,OU=Science,OU=Executive Dean Science,OU=Provost,OU=Vice-Chancellor,DC=uq,DC=edu,DC=au",
                "CN=o365-E3-Base,OU=Exchange,DC=uq,DC=edu,DC=au",
                "CN=UQ-MSTools_FS_nas02_19553_Read,OU=Production,OU=MSTools,OU=File Serving Permission Groups,OU=File,OU=Central and SLA Services,DC=uq,DC=edu,DC=au",
                "CN=UQ-MSTools_FS_nas02_19065_Write,OU=Production,OU=MSTools,OU=File Serving Permission Groups,OU=File,OU=Central and SLA Services,DC=uq,DC=edu,DC=au",
                "CN=UQ-Drupal-ess_legacy_uq-Group-Secure Content Access,OU=Sites,OU=Drupal,OU=Web Access Permission Groups,OU=Web,OU=Central and SLA Services,DC=uq,DC=edu,DC=au",
                "CN=UQ-Drupal-uq_ess-Group-Secure Content Access,OU=Sites,OU=Drupal,OU=Web Access Permission Groups,OU=Web,OU=Central and SLA Services,DC=uq,DC=edu,DC=au",
                "CN=UQ-Drupal-mbs_uq_intranet-Group-intranet user,OU=Sites,OU=Drupal,OU=Web Access Permission Groups,OU=Web,OU=Central and SLA Services,DC=uq,DC=edu,DC=au",
                "CN=UQ-Drupal-drupal_scmb-Group-Staff Directory,OU=Sites,OU=Drupal,OU=Web Access Permission Groups,OU=Web,OU=Central and SLA Services,DC=uq,DC=edu,DC=au",
                "CN=UQ-Drupal-drupal_mbs_restore-Group-MBS Intranet Staff,OU=Sites,OU=Drupal,OU=Web Access Permission Groups,OU=Web,OU=Central and SLA Services,DC=uq,DC=edu,DC=au",
                "CN=UQ-Drupal-biological_res_uq_secure-Group-intranet user,OU=Sites,OU=Drupal,OU=Web Access Permission Groups,OU=Web,OU=Central and SLA Services,DC=uq,DC=edu,DC=au",
                "CN=Science-Ricoh,OU=PaperCut Printers,OU=PaperCut,OU=Print Permission Groups,OU=Print,OU=Central and SLA Services,DC=uq,DC=edu,DC=au",
                "CN=UQ-Dropbox_Subscribed,OU=UQ-Dropbox,OU=Cloud Services,OU=Central and SLA Services,DC=uq,DC=edu,DC=au",
                "CN=UQ-MSTools_FS_nas02_16152_Write,OU=Production,OU=MSTools,OU=File Serving Permission Groups,OU=File,OU=Central and SLA Services,DC=uq,DC=edu,DC=au",
                "CN=Export Controls,OU=RPO-Mail Enabled Groups,OU=Research Partnerships Office,OU=Deputy Vice-Chancellor (Research),OU=Vice-Chancellor,DC=uq,DC=edu,DC=au",
                "CN=PCut-SCMB-Staff_All-Reports,OU=PaperCut User Groups,OU=PaperCut,OU=Print Permission Groups,OU=Print,OU=Central and SLA Services,DC=uq,DC=edu,DC=au",
                "CN=UQ-APS-Aurion_aur_11tr,OU=UQ-APS-Groups,OU=Citrix XenApp,OU=Application Presentation,OU=Central and SLA Services,DC=uq,DC=edu,DC=au",
                "CN=scmb-76-432-p1,OU=PaperCut Printers,OU=PaperCut,OU=Print Permission Groups,OU=Print,OU=Central and SLA Services,DC=uq,DC=edu,DC=au",
                "CN=UQ-MSTools_FS_nas02_15010_Write,OU=Production,OU=MSTools,OU=File Serving Permission Groups,OU=File,OU=Central and SLA Services,DC=uq,DC=edu,DC=au",
                "CN=UQ-MSTools_FS_nas02_14997_Write,OU=Production,OU=MSTools,OU=File Serving Permission Groups,OU=File,OU=Central and SLA Services,DC=uq,DC=edu,DC=au",
                "CN=UQ-MSTools_FS_nas02_14854_Write,OU=Production,OU=MSTools,OU=File Serving Permission Groups,OU=File,OU=Central and SLA Services,DC=uq,DC=edu,DC=au",
                "CN=SCI_NewUsers,OU=SCI OU Groups,OU=SCIIT-Groups,OU=Science IT Services,OU=Science,OU=Executive Dean Science,OU=Provost,OU=Vice-Chancellor,DC=uq,DC=edu,DC=au",
                "CN=UQ-MSTools_FS_nas02_14254_Write,OU=Production,OU=MSTools,OU=File Serving Permission Groups,OU=File,OU=Central and SLA Services,DC=uq,DC=edu,DC=au",
                "CN=UQ-MSTools_FS_nas02_14253_Write,OU=Production,OU=MSTools,OU=File Serving Permission Groups,OU=File,OU=Central and SLA Services,DC=uq,DC=edu,DC=au",
                "CN=UQ-MSTools_FS_nas02_14247_Write,OU=Production,OU=MSTools,OU=File Serving Permission Groups,OU=File,OU=Central and SLA Services,DC=uq,DC=edu,DC=au",
                "CN=UQ-MSTools_FS_nas02_14246_Write,OU=Production,OU=MSTools,OU=File Serving Permission Groups,OU=File,OU=Central and SLA Services,DC=uq,DC=edu,DC=au",
                "CN=UQ-MSTools_FS_nas02_14245_Write,OU=Production,OU=MSTools,OU=File Serving Permission Groups,OU=File,OU=Central and SLA Services,DC=uq,DC=edu,DC=au",
                "CN=UQ-MSTools_FS_nas02_14244_Write,OU=Production,OU=MSTools,OU=File Serving Permission Groups,OU=File,OU=Central and SLA Services,DC=uq,DC=edu,DC=au",
                "CN=UQ-MSTools_FS_nas02_14243_Write,OU=Production,OU=MSTools,OU=File Serving Permission Groups,OU=File,OU=Central and SLA Services,DC=uq,DC=edu,DC=au",
                "CN=UQ-MSTools_FS_nas02_14242_Write,OU=Production,OU=MSTools,OU=File Serving Permission Groups,OU=File,OU=Central and SLA Services,DC=uq,DC=edu,DC=au",
                "CN=UQ-MSTools_FS_nas02_14241_Write,OU=Production,OU=MSTools,OU=File Serving Permission Groups,OU=File,OU=Central and SLA Services,DC=uq,DC=edu,DC=au",
                "CN=UQ-MSTools_FS_nas02_14240_Write,OU=Production,OU=MSTools,OU=File Serving Permission Groups,OU=File,OU=Central and SLA Services,DC=uq,DC=edu,DC=au",
                "CN=UQ-MSTools_FS_nas02_14239_Write,OU=Production,OU=MSTools,OU=File Serving Permission Groups,OU=File,OU=Central and SLA Services,DC=uq,DC=edu,DC=au",
                "CN=UQ-MSTools_FS_nas02_14238_Write,OU=Production,OU=MSTools,OU=File Serving Permission Groups,OU=File,OU=Central and SLA Services,DC=uq,DC=edu,DC=au",
                "CN=UQ-MSTools_FS_nas02_14237_Write,OU=Production,OU=MSTools,OU=File Serving Permission Groups,OU=File,OU=Central and SLA Services,DC=uq,DC=edu,DC=au",
                "CN=UQ-MSTools_FS_nas02_14236_Read,OU=Production,OU=MSTools,OU=File Serving Permission Groups,OU=File,OU=Central and SLA Services,DC=uq,DC=edu,DC=au",
                "CN=UQ-MSTools_FS_nas02_14235_Write,OU=Production,OU=MSTools,OU=File Serving Permission Groups,OU=File,OU=Central and SLA Services,DC=uq,DC=edu,DC=au",
                "CN=UQ-MSTools_FS_nas02_14234_Write,OU=Production,OU=MSTools,OU=File Serving Permission Groups,OU=File,OU=Central and SLA Services,DC=uq,DC=edu,DC=au",
                "CN=UQ-MSTools_FS_nas02_14233_Write,OU=Production,OU=MSTools,OU=File Serving Permission Groups,OU=File,OU=Central and SLA Services,DC=uq,DC=edu,DC=au",
                "CN=UQ-MSTools_FS_nas02_14232_Write,OU=Production,OU=MSTools,OU=File Serving Permission Groups,OU=File,OU=Central and SLA Services,DC=uq,DC=edu,DC=au",
                "CN=UQ-MSTools_FS_nas02_14231_Write,OU=Production,OU=MSTools,OU=File Serving Permission Groups,OU=File,OU=Central and SLA Services,DC=uq,DC=edu,DC=au",
                "CN=UQ-MSTools_FS_nas02_14230_Write,OU=Production,OU=MSTools,OU=File Serving Permission Groups,OU=File,OU=Central and SLA Services,DC=uq,DC=edu,DC=au",
                "CN=UQ-MSTools_FS_nas02_14229_Write,OU=Production,OU=MSTools,OU=File Serving Permission Groups,OU=File,OU=Central and SLA Services,DC=uq,DC=edu,DC=au",
                "CN=UQ-MSTools_FS_nas02_14228_Write,OU=Production,OU=MSTools,OU=File Serving Permission Groups,OU=File,OU=Central and SLA Services,DC=uq,DC=edu,DC=au",
                "CN=UQ-MSTools_FS_nas02_14227_Write,OU=Production,OU=MSTools,OU=File Serving Permission Groups,OU=File,OU=Central and SLA Services,DC=uq,DC=edu,DC=au",
                "CN=UQ-MSTools_FS_nas02_14224_Write,OU=Production,OU=MSTools,OU=File Serving Permission Groups,OU=File,OU=Central and SLA Services,DC=uq,DC=edu,DC=au",
                "CN=UQ-MSTools_FS_nas02_14223_Write,OU=Production,OU=MSTools,OU=File Serving Permission Groups,OU=File,OU=Central and SLA Services,DC=uq,DC=edu,DC=au",
                "CN=UQ-MSTools_FS_nas02_14221_Write,OU=Production,OU=MSTools,OU=File Serving Permission Groups,OU=File,OU=Central and SLA Services,DC=uq,DC=edu,DC=au",
                "CN=UQ-MSTools_FS_nas02_14220_Write,OU=Production,OU=MSTools,OU=File Serving Permission Groups,OU=File,OU=Central and SLA Services,DC=uq,DC=edu,DC=au",
                "CN=UQ-MSTools_FS_nas02_14219_Write,OU=Production,OU=MSTools,OU=File Serving Permission Groups,OU=File,OU=Central and SLA Services,DC=uq,DC=edu,DC=au",
                "CN=UQ-MSTools_FS_nas02_14218_Write,OU=Production,OU=MSTools,OU=File Serving Permission Groups,OU=File,OU=Central and SLA Services,DC=uq,DC=edu,DC=au",
                "CN=fos-69-303-p1,OU=PaperCut Printers,OU=PaperCut,OU=Print Permission Groups,OU=Print,OU=Central and SLA Services,DC=uq,DC=edu,DC=au",
                "CN=fos-69-302-p1,OU=PaperCut Printers,OU=PaperCut,OU=Print Permission Groups,OU=Print,OU=Central and SLA Services,DC=uq,DC=edu,DC=au",
                "CN=fos-69-304-p3,OU=PaperCut Printers,OU=PaperCut,OU=Print Permission Groups,OU=Print,OU=Central and SLA Services,DC=uq,DC=edu,DC=au",
                "CN=UQ-MSTools_FS_nas02_14194_Write,OU=Production,OU=MSTools,OU=File Serving Permission Groups,OU=File,OU=Central and SLA Services,DC=uq,DC=edu,DC=au",
                "CN=SCI_iMark_LEMS,OU=FOS-Groups,OU=Science OED,OU=Science,OU=Executive Dean Science,OU=Provost,OU=Vice-Chancellor,DC=uq,DC=edu,DC=au",
                "CN=UQ-Dropbox_Users,OU=UQ-Dropbox,OU=Cloud Services,OU=Central and SLA Services,DC=uq,DC=edu,DC=au",
                "CN=SCMB_PCut_GeneralStaff,OU=SCMB-Groups,OU=Chemistry and Molecular Biosciences,OU=Science,OU=Executive Dean Science,OU=Provost,OU=Vice-Chancellor,DC=uq,DC=edu,DC=au",
                "CN=msexch_USR_uqscipa_FullMailboxSendAs,OU=Science,OU=Executive Dean Science,OU=Provost,OU=Vice-Chancellor,DC=uq,DC=edu,DC=au",
                "CN=MOEUSERS - eLearning Instructors,OU=Application Groups,OU=MOE,OU=Central and SLA Services,DC=uq,DC=edu,DC=au",
                "CN=ITS-MSTools_FileServing-ShareRequestAccess-MBS,OU=Request Access Groups,OU=MSTools,OU=File Serving Permission Groups,OU=File,OU=Central and SLA Services,DC=uq,DC=edu,DC=au",
                "CN=ITS-MSTools_FileServing-ShareRequestAccess-SCI,OU=Request Access Groups,OU=MSTools,OU=File Serving Permission Groups,OU=File,OU=Central and SLA Services,DC=uq,DC=edu,DC=au",
                "CN=GRADSC_Scholarships_Selection_Committee,OU=Graduate School,OU=Deputy Vice-Chancellor (Research),OU=Vice-Chancellor,DC=uq,DC=edu,DC=au",
                "CN=MABS_ExchMBUsers,OU=MABS-Mail Enabled Groups,OU=Medicine,OU=Executive Dean Medicine,OU=Provost,OU=Vice-Chancellor,DC=uq,DC=edu,DC=au",
                "CN=msexch_USR_uqstrfun_FullMailboxSendAs,OU=Vice-Chancellor,DC=uq,DC=edu,DC=au",
                "CN=ITS-MSFileServingManagers_PROD,OU=MSTools,OU=File Serving Permission Groups,OU=File,OU=Central and SLA Services,DC=uq,DC=edu,DC=au",
                "CN=msexch_USR_uqscifeo_FullMailboxSendAs,OU=Science,OU=Executive Dean Science,OU=Provost,OU=Vice-Chancellor,DC=uq,DC=edu,DC=au",
                "CN=ITS TMS Users,OU=ITS-Mail Enabled Groups,OU=Information Technology Services,OU=Chief Operating Officer,OU=Vice-Chancellor,DC=uq,DC=edu,DC=au",
                "CN=uqStaff,OU=Managed Groups,DC=uq,DC=edu,DC=au",
                "CN=SCMB_Pebbles_CWPA,OU=SCMB-Groups,OU=Chemistry and Molecular Biosciences,OU=Science,OU=Executive Dean Science,OU=Provost,OU=Vice-Chancellor,DC=uq,DC=edu,DC=au",
                "CN=SCI_AllUsers,OU=SCI OU Groups,OU=SCIIT-Groups,OU=Science IT Services,OU=Science,OU=Executive Dean Science,OU=Provost,OU=Vice-Chancellor,DC=uq,DC=edu,DC=au",
                "CN=SCMB_ExchMBUsers,OU=SCMB-Mail Enabled Groups,OU=Chemistry and Molecular Biosciences,OU=Science,OU=Executive Dean Science,OU=Provost,OU=Vice-Chancellor,DC=uq,DC=edu,DC=au",
                "CN=SCMB_MBS_Printers,OU=SCMB-Groups,OU=Chemistry and Molecular Biosciences,OU=Science,OU=Executive Dean Science,OU=Provost,OU=Vice-Chancellor,DC=uq,DC=edu,DC=au",
                "CN=SCMB_Pebbles_Acad,OU=SCMB-Groups,OU=Chemistry and Molecular Biosciences,OU=Science,OU=Executive Dean Science,OU=Provost,OU=Vice-Chancellor,DC=uq,DC=edu,DC=au",
                "CN=SCI_Faculty_Office_AllUsers,OU=SCI OU Groups,OU=SCIIT-Groups,OU=Science IT Services,OU=Science,OU=Executive Dean Science,OU=Provost,OU=Vice-Chancellor,DC=uq,DC=edu,DC=au",
                "CN=SCI_Chemistry_and_Molecular_Biosciences_AllUsers,OU=SCI OU Groups,OU=SCIIT-Groups,OU=Science IT Services,OU=Science,OU=Executive Dean Science,OU=Provost,OU=Vice-Chancellor,DC=uq,DC=edu,DC=au",
                "CN=CA_WebDrawUsers,OU=ITS-Security Groups,OU=Information Technology Services,OU=Chief Operating Officer,OU=Vice-Chancellor,DC=uq,DC=edu,DC=au",
                "CN=Committee Academic Board RHDC assoc,OU=ASD-Mail Enabled Groups,OU=Academic Services Division,OU=Deputy Vice-Chancellor (Academic),OU=Vice-Chancellor,DC=uq,DC=edu,DC=au",
                "CN=Committee Academic Board Research assoc,OU=ASD-Mail Enabled Groups,OU=Academic Services Division,OU=Deputy Vice-Chancellor (Academic),OU=Vice-Chancellor,DC=uq,DC=edu,DC=au",
                "CN=SCI_RFStation_DistributionList,OU=Faculty Office,OU=SCI-Mail Enabled Groups,OU=Science,OU=Executive Dean Science,OU=Provost,OU=Vice-Chancellor,DC=uq,DC=edu,DC=au",
                "CN=uqStaff_Academic-Academic,OU=Staff Class Groups,OU=Managed Groups,DC=uq,DC=edu,DC=au",
                "CN=UQ_intERAct_Users,OU=RID-Mail Enabled Groups,OU=Research Management Office,OU=Deputy Vice-Chancellor (Research),OU=Vice-Chancellor,DC=uq,DC=edu,DC=au",
                "CN=OHS-WHSR-List,OU=OHS-Mail Enabled Groups,OU=Occupational Health and Safety,OU=Chief Operating Officer,OU=Vice-Chancellor,DC=uq,DC=edu,DC=au",
                "CN=MIS-LuCIFER,OU=Business Intelligence,OU=Planning and Business Intelligence,OU=Chief Operating Officer,OU=Vice-Chancellor,DC=uq,DC=edu,DC=au",
                "CN=UQ_Directors_of_Faculty_Centres,OU=UQ-Mail Enabled Groups-HR,OU=Exchange,DC=uq,DC=edu,DC=au",
                "CN=msexch_USR_scidean_FullMailboxSendAs,OU=Science,OU=Executive Dean Science,OU=Provost,OU=Vice-Chancellor,DC=uq,DC=edu,DC=au",
                "CN=UQ_USMC,OU=UQ-Mail Enabled Groups-HR,OU=Exchange,DC=uq,DC=edu,DC=au",
                "CN=uqStaffHosted,OU=Managed Groups,DC=uq,DC=edu,DC=au",
                "CN=SCI_AcademicStaff,OU=Faculty Office,OU=SCI-Mail Enabled Groups,OU=Science,OU=Executive Dean Science,OU=Provost,OU=Vice-Chancellor,DC=uq,DC=edu,DC=au",
                "CN=DVC-A_ExchMBUsers,OU=DVC-A-Mail Enabled Groups,OU=Deputy Vice-Chancellor (Academic),OU=Vice-Chancellor,DC=uq,DC=edu,DC=au",
                "CN=SMMS_Staff_Authors,OU=SCMB-Mail Enabled Groups,OU=Chemistry and Molecular Biosciences,OU=Science,OU=Executive Dean Science,OU=Provost,OU=Vice-Chancellor,DC=uq,DC=edu,DC=au",
                "CN=UQ-APS-USERS,OU=UQ-APS-Groups,OU=Citrix XenApp,OU=Application Presentation,OU=Central and SLA Services,DC=uq,DC=edu,DC=au",
                "CN=lib_rqa_assessed,OU=LIB-groups,OU=University of Queensland Library,OU=Deputy Vice-Chancellor (Academic),OU=Vice-Chancellor,DC=uq,DC=edu,DC=au",
                "CN=SCI_ExchMBUsers,OU=SCI-Mail Enabled Groups,OU=Science,OU=Executive Dean Science,OU=Provost,OU=Vice-Chancellor,DC=uq,DC=edu,DC=au",
                "CN=MIS-DeskIUsers,OU=Business Intelligence,OU=Planning and Business Intelligence,OU=Chief Operating Officer,OU=Vice-Chancellor,DC=uq,DC=edu,DC=au"
            ],
            "classes": [],
            "expiryDate": "31-12-19",
            "hasSession": true,
            "tokenBased": false,
            "canMasquerade": false,
            "blocked": false
    };
    const currentAuthorApiData = {
        "data": {
            "aut_id": 1671,
            "aut_org_username": "uqmbrow1",
            "aut_org_staff_id": "0024086",
            "aut_org_student_id": null,
            "aut_email": "",
            "aut_display_name": "Brown, Melissa Anne",
            "aut_fname": "Melissa",
            "aut_mname": "Anne",
            "aut_lname": "Brown",
            "aut_title": "Professor",
            "aut_position": "",
            "aut_homepage_link": "",
            "aut_created_date": "2006-03-31T00:00:00Z",
            "aut_update_date": "2017-12-11T02:48:18Z",
            "aut_external_id": "0000053086",
            "aut_ref_num": "",
            "aut_researcher_id": "F-1451-2010",
            "aut_scopus_id": "160618002616",
            "aut_mypub_url": "",
            "aut_rid_password": "",
            "aut_people_australia_id": "",
            "aut_description": "",
            "aut_orcid_id": "0000-0003-4976-7483",
            "aut_google_scholar_id": "hjhghgjhgjhg",
            "aut_rid_last_updated": "2016-10-07",
            "aut_publons_id": null,
            "aut_student_username": null
        }
    };
    const authorDetailsApiData = {
        "uqr_id": 937,
        "espace_id": 1671,
        "image_exists": 1,
        "username": "uqmbrow1",
        "staff_id": "0024086",
        "given_name": "Melissa",
        "family_name": "Brown",
        "title": "Professor",
        "scopus_id": "160618002616",
        "google_scholar_id": null,
        "researcher_id": "F-1451-2010",
        "orcid_id": "0000-0003-4976-7483",
        "publons_id": null,
        "mypub_url": "",
        "org_units": [
            "Faculty of Science",
            "Mater Research Institute-UQ"
        ],
        "positions": [
            "Affiliate Professor",
            "Executive Dean"
        ],
        "espace": {
            "first_year": 1987,
            "last_year": 2016,
            "doc_count": "126"
        }
    };

    // Set a mock date for account API
    const DATE_TO_USE = new Date('2016');
    const _Date = Date;
    global.Date = jest.fn(() => DATE_TO_USE);
    global.Date.UTC = _Date.UTC;
    global.Date.parse = _Date.parse;
    global.Date.now = _Date.now;

    it('calls 6 actions to load a user account, author and author details', () => {

        mock.onGet(repositories.routes.ACCOUNT_API())
            .reply(200, accountApiData)
            .onGet(repositories.routes.CURRENT_AUTHOR_API())
            .reply(200, currentAuthorApiData)
            .onGet(repositories.routes.AUTHOR_DETAILS_API({userId: 'uqmbrow1'}))
            .reply(200, authorDetailsApiData);

        const expectedActions = [
            {type: actions.ACCOUNT_LOADING},
            {type: actions.ACCOUNT_LOADED},
            {type: actions.ACCOUNT_AUTHOR_LOADING},
            {type: actions.ACCOUNT_AUTHOR_LOADED},
            {type: actions.ACCOUNT_AUTHOR_DETAILS_LOADING},
            {type: actions.ACCOUNT_AUTHOR_DETAILS_LOADED},
        ];

        const store = getMockStore();

        return store.dispatch(accountActions.loadCurrentAccount()).then(() => {
            expectStoreHasExpectedActions(store, expectedActions);
        });
    });

    it('calls 3 actions to load a user account, author and author details - account api failure', () => {

        mock.onGet(repositories.routes.ACCOUNT_API())
            .reply(403)
            .onGet(repositories.routes.CURRENT_AUTHOR_API())
            .reply(200, currentAuthorApiData)
            .onGet(repositories.routes.AUTHOR_DETAILS_API({userId: 'uqmbrow1'}))
            .reply(200, authorDetailsApiData);

        const expectedActions = [
            {type: actions.ACCOUNT_LOADING},
            {type: actions.ACCOUNT_ANONYMOUS},
            {type: actions.ACCOUNT_AUTHOR_DETAILS_FAILED}
        ];

        const store = getMockStore();

        return store.dispatch(accountActions.loadCurrentAccount()).then(() => {
            expectStoreHasExpectedActions(store, expectedActions);
        });
    });
    it('calls 4 actions to load a user account, author and author details - author api failure', () => {

        mock.onGet(repositories.routes.ACCOUNT_API())
            .reply(200, accountApiData)
            .onGet(repositories.routes.CURRENT_AUTHOR_API())
            .reply(403)
            .onGet(repositories.routes.AUTHOR_DETAILS_API({userId: 'uqmbrow1'}))
            .reply(200, authorDetailsApiData);

        const expectedActions = [
            {type: actions.ACCOUNT_LOADING},
            {type: actions.ACCOUNT_LOADED},
            {type: actions.ACCOUNT_AUTHOR_LOADING},
            {type: actions.ACCOUNT_AUTHOR_FAILED},
            {type: actions.ACCOUNT_AUTHOR_DETAILS_FAILED},
        ];

        const store = getMockStore();

        return store.dispatch(accountActions.loadCurrentAccount()).then(() => {
            expectStoreHasExpectedActions(store, expectedActions);
        });
    });

    it('calls 6 actions to load a user account, author and author details - author details api failure', () => {

        mock.onGet(repositories.routes.ACCOUNT_API())
            .reply(200, accountApiData)
            .onGet(repositories.routes.CURRENT_AUTHOR_API())
            .reply(200, currentAuthorApiData)
            .onGet(repositories.routes.AUTHOR_DETAILS_API({userId: 'uqmbrow1'}))
            .reply(403);

        const expectedActions = [
            {type: actions.ACCOUNT_LOADING},
            {type: actions.ACCOUNT_LOADED},
            {type: actions.ACCOUNT_AUTHOR_LOADING},
            {type: actions.ACCOUNT_AUTHOR_LOADED},
            {type: actions.ACCOUNT_AUTHOR_DETAILS_LOADING},
            {type: actions.ACCOUNT_AUTHOR_DETAILS_FAILED},
        ];

        const store = getMockStore();

        return store.dispatch(accountActions.loadCurrentAccount()).then(() => {
            expectStoreHasExpectedActions(store, expectedActions);
        });
    });

    it('calls 3 actions to load a user account, author and author details - all api fail', () => {

        mock.onGet(repositories.routes.ACCOUNT_API())
            .reply(403)
            .onGet(repositories.routes.CURRENT_AUTHOR_API())
            .reply(403)
            .onGet(repositories.routes.AUTHOR_DETAILS_API({userId: 'uqmbrow1'}))
            .reply(403);

        const expectedActions = [
            {type: actions.ACCOUNT_LOADING},
            {type: actions.ACCOUNT_ANONYMOUS},
            {type: actions.ACCOUNT_AUTHOR_DETAILS_FAILED}
        ];

        const store = getMockStore();

        return store.dispatch(accountActions.loadCurrentAccount()).then(() => {
            expectStoreHasExpectedActions(store, expectedActions);
        });
    });


    it('calls 3 actions when a users session has expired', () => {

        mock.onGet(repositories.routes.ACCOUNT_API())
                .reply(200, {...accountApiData, hasSession: false});

        const expectedActions = [
            {type: actions.ACCOUNT_LOADING},
            {type: actions.ACCOUNT_ANONYMOUS},
            {type: actions.ACCOUNT_AUTHOR_DETAILS_FAILED}
        ];

        const store = getMockStore();

        return store.dispatch(accountActions.loadCurrentAccount()).then(() => {
            expectStoreHasExpectedActions(store, expectedActions);
        }).catch((error) => {
            expect(error.message).toEqual('Session expired. User is unauthorized.');
        });
    });

    it('calls 1 action when a user logs out', () => {

        const expectedActions = [{type: actions.ACCOUNT_ANONYMOUS}];
        const store = getMockStore();
        store.dispatch(accountActions.logout());
        expectStoreHasExpectedActions(store, expectedActions);
    });

});
