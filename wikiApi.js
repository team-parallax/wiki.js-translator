import { GraphQLClient, gql } from 'graphql-request';
import dotenv from 'dotenv';

dotenv.config();

const client = new GraphQLClient(process.env.WIKI_API_URL, {
	headers: {
		"Content-Type": "application/json",
		Authorization: `Bearer ${process.env.WIKI_API_TOKEN}`,
	},
});

export const fetchAllPages = async (locale) => {
	const query = gql`
	query($locale: String!){
      pages {
        list(locale: $locale) {
          id
          locale
          path
          title
          description
        }
      }
	}
  `;
	const variables = { locale };
	const data = await client.request(query, variables);
	return data.pages.list;
};

export const fetchSinglePages = async (id) => {
	const query = gql`
  query ($id: Int!) {
    pages {
      single(id: $id) {
        id
        locale
        path
        title
        description
        content
      }
    }
  }
`;
	const variables = { id };
	const data = await client.request(query, variables);
	return data.pages.single;
};

export const createPage = async (title, content, path, locale) => {
	const mutation = `
    mutation($title: String!, $path: String!, $locale: String!, $content: String!) {
      pages {
        create(title: $title, content: $content, path: $path, locale: $locale, isPublished: true, isPrivate: false, tags: [], editor: "markdown", description: "") {
          page {
            id
          }
        }
      }
    }
  `;
	const variables = {
		title, content, path, locale
	};
	const data = await client.request(mutation, variables);
	return data.pages.create;
};

export const checkPageExists = async (path, locale) => {
	const query = `
    query($path: String!, $locale: String!) {
      pages {
        singleByPath(path: $path, locale: $locale) {
          id
        }
      }
    }
  `;
	const variables = { path, locale };
	try {
		const data = await client.request(query, variables);
		return !!data.pages.singleByPath;
	} catch (error) {
		if (error.response.errors[0].message === "This page does not exist.") {
			return false;
		}
		throw error;
	}
};
