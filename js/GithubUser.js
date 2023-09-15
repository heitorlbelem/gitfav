export class GithubUser {
  static async search(username) {
    const endpoint = `https://api.github.com/users/${username}`

    return fetch(endpoint)
      .then((response) => response.json())
      .then(({ login, name, followers, public_repos }) => ({
        login,
        name,
        followers,
        public_repos,
      }))
  }
}
