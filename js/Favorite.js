import { GithubUser } from "./GithubUser.js"
class Favorite {
  constructor(root) {
    this.root = document.getElementById(root)

    this.load()
  }

  load() {
    this.users = JSON.parse(localStorage.getItem("@gitfav-users:")) || []
  }

  save() {
    localStorage.setItem("@gitfav-users:", JSON.stringify(this.users))
  }

  async add(username) {
    try {
      const userExists = this.users.find((user) => user.login === username)
      if (userExists) {
        throw new Error("Usuário já está registrado como favorito")
      }

      const newUser = await GithubUser.search(username)
      if (newUser.login === undefined) {
        throw new Error("Usuário não encontrado")
      }

      this.users = [newUser, ...this.users]
      this.save()
      this.update()
    } catch (error) {
      alert(error.message)
    }
  }

  delete(username) {
    const filteredUsers = this.users.filter((user) => user.login !== username)

    this.users = filteredUsers
    this.save()
    this.update()
  }
}

export class FavoriteView extends Favorite {
  constructor(root) {
    super(root)
    this.tBody = this.root.querySelector("table tbody")
    this.emptyRow = this.root.querySelector("#empty-row")
    this.update()
    this.onadd()
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

  onadd() {
    const addButton = this.root.querySelector("#add-button")

    addButton.onclick = (e) => {
      e.preventDefault()
      const { value } = this.root.querySelector("#search")

      this.add(value)
    }
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

    if (this.users.length === 0) {
      const emptyRow = this.createEmptyRow()

      this.tBody.append(emptyRow)
    }
  }

  createEmptyRow() {
    const row = document.createElement("tr")
    row.setAttribute("id", "empty-row")
    row.innerHTML = `
      <td>
        <div id="empty-body">
          <img src="./assets/Estrela.svg" alt="" />
          <h2>Nenhum favorito ainda</h2>
        </div>
      </td>
      <td></td>
      <td></td>
      <td></td>
    `

    return row
  }
}
