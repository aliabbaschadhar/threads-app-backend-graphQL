import type { CreateUserPayload, GetUserTokenPayload } from "../../services/user"
import UserService from "../../services/user"

const queries = {
  hello: () => "Yo bro!",
  getUserToken: async (_: any, payload: GetUserTokenPayload) => {
    const { email, password } = payload;
    const token = await UserService.getUserToken({
      email, password
    })
    return token;
  },
  getCurrentLoggedInUser: async (_: any, parameters: any, context: any) => {
    if (context?.user) {
      const id = context.user.id;
      const user = await UserService.getUserById(id);
      return user;
    }
    throw new Error("I don't know the current user!")
  },
}

const mutations = {
  createUser: async (_: any, payload: CreateUserPayload) => {
    const res = await UserService.createUser(payload);
    return res.id;
  }
}

export const resolvers = { queries, mutations }