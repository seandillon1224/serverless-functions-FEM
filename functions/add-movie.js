const { query } = require('./util/hasura')

exports.handler = async (event) => {
    const {id, title, tagline, poster} = JSON.parse(event.body);

    const variables = {
        id,
        title,
        tagline,
        poster
    };

    const result = await query({
            query: `
            mutation ($id: String!, $poster: String!, $tagline: String!, $title: String!) {
                insert_movies_one(object: {id: $id, poster: $poster, tagline: $tagline, title: $title}) {
                  id
                  poster
                  tagline
                  title
                }
              }`,
              variables
        });

        console.log(result)
        
        return {
            statusCode: 200,
            body: JSON.stringify(result)
        };
    

}