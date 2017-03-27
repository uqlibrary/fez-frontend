export const planCollaborators = [
    // Plan 1
    {
        planId: 1,
        collaboratorId: 1,
        isOwner: true,
        isLead: true,
        status: 1
    },
    {
        planId: 1,
        collaboratorId: 2,
        isOwner: false,
        isLead: false,
        status: 1
    },
    {
        planId: 1,
        collaboratorId: 3,
        isOwner: false,
        isLead: false,
        status: 0
    },
    // Plan 2
    {
        planId: 2,
        collaboratorId: 1,
        isOwner: true,
        isLead: false,
        status: 1
    },
    {
        planId: 2,
        collaboratorId: 2,
        isOwner: false,
        isLead: true,
        status: 0
    },
    // Plan 3, 4, 5 (1 owner)
    {
        planId: 3,
        collaboratorId: 1,
        isOwner: true,
        isLead: true,
        status: 1
    },
    {
        planId: 4,
        collaboratorId: 1,
        isOwner: true,
        isLead: true,
        status: 1
    },
    {
        planId: 5,
        collaboratorId: 1,
        isOwner: true,
        isLead: true,
        status: 1
    },
    // Hidden plan for Bob Marley
    {
        planId: 6,
        collaboratorId: 2,
        isOwner: true,
        isLead: true,
        status: 1
    },
    {
        planId: 7,
        collaboratorId: 1,
        isOwner: true,
        isLead: false,
        status: 1
    },
    {
        planId: 7,
        collaboratorId: 2,
        isOwner: false,
        isLead: true,
        status: 1
    },
    // Plan where Bob Marley is lead, but not owner
    {
        planId: 8,
        collaboratorId: 2,
        isOwner: true,
        isLead: false,
        status: 1
    },
    {
        planId: 8,
        collaboratorId: 1,
        isOwner: false,
        isLead: true,
        status: 1
    },
    {
        planId: 9,
        collaboratorId: 1,
        isOwner: true,
        isLead: true,
        status: 1
    },
];
