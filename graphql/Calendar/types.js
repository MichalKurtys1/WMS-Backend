export const types = `
scalar JSON

type Calendar {
    id: ID!
    date: String!
    time: String!
    event: String!
  }

  type FormatedCalendar {
    standardData: JSON!
    carrierData: JSON!
  }

`;
