import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getFilterSchemaFor,
  getModelSchemaRef,
  getWhereSchemaFor,
  patch,
  put,
  del,
  requestBody,
} from '@loopback/rest';
import {
  ArmorRepository,
  SkillRepository,
  WeaponRepository,
  CharacterRepository,
} from '../repositories';
import {
  Armor,
  Skill,
  Weapon,
  Character,
} from '../models';

export class UpdateCharacterController {
  constructor(
    @repository(CharacterRepository)
    public characterRepository : CharacterRepository,

    @repository(ArmorRepository)
    public armorRepository: ArmorRepository,

    @repository(SkillRepository)
    public skillRepository: SkillRepository,

    @repository(WeaponRepository)
    public weaponRepository: WeaponRepository,
  ) {}

  @patch('/updatecharacter/{id}/weapon', {
    responses: {
      '200': {
        description: 'update weapon for character with {id}',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Weapon)
          }
        }
      },
    },
  })
  async updateWeapon(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Weapon, {
            exclude: ['id']
          })
        }
      },
    }) weapon: Omit<Weapon, 'id'>,
  ): Promise<Weapon> {
    // equip weapon
    const char = await this.characterRepository.findById(id);
    char.attack! += weapon.attack;
    char.defence! += weapon.defence;

    // unequip the old weapon
    const filter: Filter = {where: {'characterId': id}};
    if ((await this.weaponRepository.find(filter))[0] != undefined) {
      const oldWeapon: Weapon = await this.characterRepository.weapon(id).get();
      char.attack! -= oldWeapon.attack;
      char.defence! -= oldWeapon.defence;
      await this.characterRepository.weapon(id).delete();
    }

    // update changes made to character.
    await this.characterRepository.updateById(id, char);

    return this.characterRepository.weapon(id).create(weapon);
  }

  @patch('/updatecharacter/{id}/armor', {
    responses: {
      '200': {
        description: 'Update the armor of the character',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Armor),
          }
        },
      }
    }
  })
  async updateArmor(
    @param.path.string('string') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Armor, {
            exclude: ['id']
          })
        }
      }
    }) armor: Omit<Armor, 'id'>
  ): Promise<Armor> {
    // Equip the Armor.
    const char = await this.characterRepository.findById(id);
    char.attack! += armor.attack;
    char.defence! += armor.defence;

    const filter: Filter = {where:{"characterId":id}};
    // if there was an armor before remove it
    if ((await this.armorRepository.find(filter))[0] != undefined) {
      const oldArmor: Armor = await this.characterRepository.armor(id).get();
      char.attack! -= oldArmor.attack;
      char.defence! -= oldArmor.defence;
      await this.characterRepository.armor(id).delete();
    }

    // update changes made to the character 
    await this.characterRepository.updateById(id, char);

    return this.characterRepository.armor(id).create(armor);
  }

  @patch('/updatecharacter/{id}/skill', {
    responses: {
      '200': {
        description: 'update the skills of a character with {id}',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Skill)
          }
        }
      }
    }
  })
  async updateSkill(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Skill, {
            exclude: ['id']
          }),
        },
      },
    }) skill: Omit<Skill, 'id'>
  ): Promise<Skill> {
    // if there's a skill remove it.
    await this.characterRepository.skill(id).delete();
    return this.characterRepository.skill(id).create(skill);
  }

  @del('/updatecharacter/{id}/weapon', {
    responses: {
      '204': {
        description: 'Character\'s weapon DELETE success',
      },
    },
  })
  async deleteWeapon(@param.path.string('id') id: string): Promise<void> {
    const filter: Filter = {where: {'characterId': id}};
    if ((await this.weaponRepository.find(filter))[0] != undefined) {
      const oldWeapon: Weapon = await this.characterRepository.weapon(id).get();
      const char: Character = await this.characterRepository.findById(id);
      char.attack! -= oldWeapon.attack;
      char.defence! -= oldWeapon.defence;
      await this.characterRepository.weapon(id).delete();
      await this.characterRepository.updateById(id, char);
    }
  }

  @del('/updatecharacter/{id}/armor', {
    responses: {
      '204': {
        description: 'Character\'s armor DELETE success',
      }
    }
  })
  async deleteArmor(@param.path.string('id') id: string): Promise<void> {
    const filter: Filter = {where: {'characterId': id}};
    if ((await this.armorRepository.find(filter))[0] != undefined) {
      const oldArmor: Armor = await this.characterRepository.armor(id).get();
      const char: Character = await this.characterRepository.findById(id);
      char.attack! -= oldArmor.attack;
      char.defence! -= oldArmor.defence;
      await this.characterRepository.armor(id).delete();
      await this.characterRepository.updateById(id, char);
    }
  }

  @del('/updatecharacter/{id}/skill', {
    responses: {
      '204': {
        description: 'Character\'s skill DELETE success',
      }
    }
  })
  async deleteSkill(@param.path.string('id') id: string): Promise<void> {
    await this.characterRepository.skill(id).delete();
  }

  @patch('/updatecharacter/{id}/levelUp', {
    responses: {
      '200': {
        description: 'level up a character',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Character),
          },
        },
      },
    },
  })
  async levelUpCharacter(@param.path.string('id') id: string): Promise<Character> {
    const char: Character = await this.characterRepository.findById(id);
    let levels: number = 0;
    while(char.currentExp! >= char.nextLevelExp!){
      levels++;
      char.currentExp! -= char.nextLevelExp!;
      char.nextLevelExp! += 100;
    }
    char.level! += levels;
    char.maxHealth! += 10 * levels;
    char.currentHealth! = char.maxHealth!;
    char.maxMana! += 5 * levels;
    char.currentMana! = char.maxMana!;
    char.attack! += 3 * levels;
    await this.characterRepository.updateById(id, char);
    return char;
  }

  @get('/updatecharacter/{id}', {
    responses: {
      '200': {
        description: 'Get the last information stored on this character',
        content: {},
      },
    }
  })
  async findById(
    @param.path.string('id') id: string,
  ): Promise<any[]> {
    let res: any[] = ['no weapons', 'no armor', 'no skill'];

    let filter: Filter = {where:{"characterId":id}};
    
    if ((await this.weaponRepository.find(filter))[0] != undefined) {
      res[0] = await this.characterRepository.weapon(id).get()
    }

    if ((await this.armorRepository.find(filter))[0] != undefined) {
      res[1] = await this.characterRepository.armor(id).get()
    }

    if ((await this.skillRepository.find(filter))[0] != undefined) {
      res[2] = await this.characterRepository.skill(id).get()
    }

    return res;
  }
}
