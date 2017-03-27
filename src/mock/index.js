import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import moment from 'moment';

const queryString = require('query-string');

// Data
import { plans } from './data/plans';
import { planCollaborators } from './data/planCollaborators';
import { collaborators } from './data/collaborators';
import { staff } from './data/staff';
import { faqs } from './data/faqs';

const mock = new MockAdapter(axios);

// Build a full collaborator list
const collaboratorList = collaborators.map(c => {
    const staffEntry = staff.find(s => s.username === c.username);
    if (staffEntry !== undefined) {
        c.name = staffEntry.name;
        c.mail = staffEntry.mail;
        c.uq = true;
    }
    return c;
});

// Enhance the plans array with collaborator data
const planList = plans.map(p => {
    p.collaborators = planCollaborators.filter(c => c.planId === p.id);
    p.collaborators = p.collaborators.map(c => {
        return Object.assign({}, c, collaboratorList.find(coll => coll.id === c.collaboratorId));
    });
    p.lastEdited = moment().format('YYYY-MM-DD');
    return p;
});

const nextPlanId = () => {
    let highest = 0;
    planList.map(item => {
        highest = item.id > highest ? item.id : highest;
    });
    return highest + 1;
};

// Mock the account that the user is logged in as
let account = staff.find(s => s.username === queryString.parse(location.search).user);
if (account === undefined) {
    account = staff.find(s => s.username === 'uqbmarley');
}
account.hasSession = true;

// Account route
mock.onGet('/account').reply(200, account);

mock.onGet(/\/plans\?status=*/).reply(config => {
    const status = parseInt(config.url.replace('/plans?status=', ''), 10);

    // Helper functions
    const isOwner = (a, plan) => plan.collaborators.find(c => c.username === a.username).isOwner;
    const isLead = (a, plan) => plan.collaborators.find(c=> c.username === a.username).isLead;

    const filteredPlans = planList.filter(p => {
        let valid = true;

        if (
           p.status !== status ||
           p.collaborators.findIndex(c => c.username === account.username) === -1 ||
           (p.status === 0 && isOwner(account, p) === false) ||
           ((p.status === 2 || p.status === 3) && isOwner(account, p) === false && isLead(account, p) === false)) {
            valid = false;
        }
        return valid;
    });

    return [200, filteredPlans];
});

mock.onGet('/plans').reply(() => {
    const filteredPlans = planList.filter(p => p.collaborators.findIndex(c => c.username === account.username) !== -1);
    return [200, filteredPlans];
});
mock.onGet('/staff').reply(200, staff);

mock.onGet(new RegExp(/\/plans\/*/)).reply(config => {
    const planId = parseInt(config.url.replace('/plans/', ''), 10);
    return [200, planList.find(item => item.id === planId)];
});

mock.onGet(/\/code-availability*/).reply(config => {
    const code = config.url.replace('/code-availability/', '');
    return [200, !code.startsWith('A')];
});

// Create Plan - save for later
mock.onPost('/plans').reply(config => {
    const plan = JSON.parse(config.data);
    plan.id = plan.id || nextPlanId();
    plan.lastEdited = moment().format('YYYY-MM-DD');
    plan.status = plan.status || 0;
    planList.push(plan);
    return [200, plan];
});

// Save specific plan
mock.onPost(new RegExp(/\/plans\/[0-9]*$/)).reply(config => {
    const data = JSON.parse(config.data);
    const index = planList.findIndex(item => item.id === data.id);
    data.lastEdited = moment().format('YYYY-MM-DD');
    planList[index] = data;
    return [200, data];
});

// Submit plan
mock.onPost(new RegExp(/\/plans\/[0-9]*\/submit$/)).reply(config => {
    const planId = parseInt(config.url.replace('/plans/', '').replace('/submit', ''), 10);
    const plan = planList.find(item => item.id === planId);

    // Set new status
    if (plan.status === 2) {
        plan.status = 3;
    } else {
        const owner = plan.collaborators.find(item => item.isOwner === true);
        plan.status = owner.isLead ? 3 : 2;
    }

    plan.lastEdited = moment().format('YYYY-MM-DD');
    return [200, plan];
});

// Contacts
mock.onGet('/my-collaborators').reply(() => {
    const collaboratorPlans = [];

    planList.filter(p => p.collaborators.findIndex(c => c.username === account.username) !== -1).map(p => {
        // Make map of all collaborator -> plans
        p.collaborators.map(c => {
            if (c.username !== account.username) {
                if (collaboratorPlans.find(item => item.username === c.username) === undefined) {
                    collaboratorPlans.push(Object.assign({}, c, {plans: []}));
                }
                collaboratorPlans.find(item => item.username === c.username).plans.push(p.id);
            }
        });
    });

    return [200, collaboratorPlans];
});

// Faqs
mock.onGet('/faqs').reply(200, faqs);

mock.onGet(new RegExp(/\/faqs\/*/)).reply(config => {
    const faqId = parseInt(config.url.replace('/faqs/', ''), 10);
    const faq = faqs.find(item => item.id === faqId);
    faq.views = faq.views + 1;
    return [200, {}];
});

mock.onPost('/contact-us').reply(200);
