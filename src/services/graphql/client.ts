const GRAPHQL_ENDPOINT = 'http://localhost:8000/graphql'

export const fetchGraphQL = async <T>(query: string, variables = {}): Promise<T> => {
  try {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    })
    
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }

    return response.json()
  } catch (error) {
    console.error('Error fetching GraphQL:', error)
    throw error
  }
}
