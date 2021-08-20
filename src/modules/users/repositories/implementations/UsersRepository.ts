import { getRepository, Repository } from "typeorm";

import { IFindUserWithGamesDTO, IFindUserByFullNameDTO } from "../../dtos";
import { User } from "../../entities/User";
import { IUsersRepository } from "../IUsersRepository";

export class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async findUserWithGamesById({
    user_id,
  }: IFindUserWithGamesDTO): Promise<User> {
    const games = await this.repository
      .createQueryBuilder("users")
      .leftJoinAndSelect("users.games", "games")
      .where("users.id = :id", { id: `${user_id}` })
      .getOneOrFail();
    return games;
    // Complete usando ORM
  }

  async findAllUsersOrderedByFirstName(): Promise<User[]> {
    const SqlQuery = "SELECT * FROM users ORDER BY first_name ASC";
    return this.repository.query(SqlQuery); // Complete usando raw query
  }

  async findUserByFullName({
    first_name,
    last_name,
  }: IFindUserByFullNameDTO): Promise<User[] | undefined> {
    const rawQuery =
      "SELECT * FROM users WHERE first_name ILIKE $1 AND last_name ILIKE $2";
    return this.repository.query(rawQuery, [first_name, last_name]); // Complete usando raw query
  }
}
