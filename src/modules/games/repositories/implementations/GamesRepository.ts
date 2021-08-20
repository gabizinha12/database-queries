import { getRepository, Repository } from "typeorm";

import { User } from "../../../users/entities/User";
import { Game } from "../../entities/Game";

import { IGamesRepository } from "../IGamesRepository";

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    return this.repository
      .createQueryBuilder("games")
      .where("games.title ILIKE :title", { title: `%${param}%` })
      .getMany();
    // Complete usando query builder
  }

  async countAllGames(): Promise<[{ count: string }]> {
    const sqlQuery = "SELECT COUNT(*) FROM GAMES";
    return this.repository.query(sqlQuery); // Complete usando raw query
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    const games = await this.repository
      .createQueryBuilder("games")
      .leftJoinAndSelect("games.users", "users")
      .where("games.id = :id", { id: `${id}` })
      .getOneOrFail();
    const users = games.users;
    return users;

    // Complete usando query builder
  }
}
