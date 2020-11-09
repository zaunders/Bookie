import { AppWebsocket } from "@holochain/conductor-api";
import {
  profilesTypeDefs,
  profilesResolvers,
} from "@holochain-open-dev/profiles";
import { ApolloClient, gql, InMemoryCache } from "@apollo/client/core";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { SchemaLink } from "@apollo/client/link/schema";

export const rootTypeDef = gql`
  type Query {
    _: Boolean
  }

  type Mutation {
    _: Boolean
  }
`;

const allTypeDefs = [rootTypeDef, profilesTypeDefs];

export async function setupClient(url: string): Promise<ApolloClient<any>> {
  const appWebsocket = await AppWebsocket.connect(url);

  const appInfo = await appWebsocket.appInfo({ app_id: "test-app" });

  const cellId = appInfo.cell_data[0][0];

  const executableSchema = makeExecutableSchema({
    typeDefs: allTypeDefs,
    resolvers: [profilesResolvers(appWebsocket, cellId)],
  });

  const schemaLink = new SchemaLink({ schema: executableSchema });

  return new ApolloClient({
    typeDefs: allTypeDefs,
    cache: new InMemoryCache(),
    link: schemaLink,
  });
}
