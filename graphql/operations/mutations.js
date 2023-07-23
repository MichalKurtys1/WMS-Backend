export const mutations = `
createOperation(
    deliveriesId: ID
    ordersId: ID
    transfersId: ID
): Operation!
updateOperation(
    operationId: ID!
    stage: Float!
    data: JSON!
): Operation!
`;
