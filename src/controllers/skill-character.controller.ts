import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Skill,
  Character,
} from '../models';
import {SkillRepository} from '../repositories';

export class SkillCharacterController {
  constructor(
    @repository(SkillRepository)
    public skillRepository: SkillRepository,
  ) { }

  @get('/skills/{id}/character', {
    responses: {
      '200': {
        description: 'Character belonging to Skill',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Character)},
          },
        },
      },
    },
  })
  async getCharacter(
    @param.path.string('id') id: typeof Skill.prototype.id,
  ): Promise<Character> {
    return this.skillRepository.character(id);
  }
}
