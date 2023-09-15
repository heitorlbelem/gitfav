class Favorite {
  constructor(root) {
    this.root = document.getElementById(root)

    this.load()
  }

  load() {
    this.users = [
      {
        login: "heitorlbelem",
        name: "Heitor Belem",
        public_repos: 72,
        followers: 19,
      },
      {
        login: "maykbrito",
        name: "Mayk Brito",
        public_repos: 72,
        followers: 19,
      },
    ]
  }

  delete(username) {
    const filteredUsers = this.users.filter((user) => user.login !== username)

    this.users = filteredUsers
    this.update()
  }
}

export class FavoriteView extends Favorite {
  constructor(root) {
    super(root)
    this.tBody = this.root.querySelector("table tbody")
    this.update()
  }

  update() {
    this.removeAllTableBodyRows()

    this.users.forEach((user) => {
      const row = this.createTableRow(user)

      row.querySelector(".remove").onclick = () => {
        const isOk = confirm(
          "Tem certeza que deseja remover esse usuário da lista de favoritos?"
        )

        if (isOk) {
          this.delete(user.login)
        }
      }

      this.tBody.append(row)
    })
  }

  createTableRow({ login, name, public_repos, followers }) {
    const tr = document.createElement("tr")

    tr.innerHTML = `
      <td class="user">
        <img src="https://github.com/${login}.png" alt="" />
        <a href="https://github.com/${login}">
          <p>${name}</p>
          <span>/${login}</span>
        </a>
      </td>
      <td>${public_repos}</td>
      <td>${followers}</td>
      <td>
        <button class="remove">Remover</button>
      </td>
    `

    return tr
  }

  removeAllTableBodyRows() {
    this.tBody.querySelectorAll("tr").forEach((tr) => {
      tr.remove()
    })
  }
}
