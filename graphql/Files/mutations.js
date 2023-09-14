export const mutations = `
fileUpload(file: Upload!, name: String!, id: String! date: String!): Boolean!
fileDownload( filename: String!): String!
fileDelete( filename: String!): Boolean!
`;
