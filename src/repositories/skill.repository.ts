import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {Skill, SkillRelations, Character} from '../models';
import {TestDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {CharacterRepository} from './character.repository';

export class SkillRepository extends DefaultCrudRepository<
  Skill,
  typeof Skill.prototype.id,
  SkillRelations
> {

  public readonly character: BelongsToAccessor<Character, typeof Skill.prototype.id>;

  constructor(
    @inject('datasources.test') dataSource: TestDataSource, @repository.getter('CharacterRepository') protected characterRepositoryGetter: Getter<CharacterRepository>,
  ) {
    super(Skill, dataSource);
    this.character = this.createBelongsToAccessorFor('character', characterRepositoryGetter,);
  }
}
