const queries = {
  hello: () => "Yo bro!"
}

const mutations = {
  createUser: async (_: any, { }: {}) => {
    return "randomId"
  }
}

export const resolvers = { queries, mutations }