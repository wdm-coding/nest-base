import * as yaml from 'js-yaml'
import {readFileSync} from 'fs'
import {merge} from 'lodash'
import * as Joi from 'joi'
import { Env } from '../../enum/env.enum';
import {resolve} from 'path'

const envPath = resolve(process.cwd(), 'env', `env.${process.env.NODE_ENV}.yml`)
const commonPath = resolve(process.cwd(), 'env', 'env.yml')

const mergeConfig = () => {
  try {
    const commonConfig = yaml.load(readFileSync(commonPath, 'utf-8')) as Record<string, any>
    const envConfig = yaml.load(readFileSync(envPath, 'utf-8')) as Record<string, any>
    const merged = merge({}, commonConfig, envConfig)
    return merged
  } catch (error) {
    console.error('yaml文件加载失败:', error)
    throw error
  }
}

const JoiSchema = (config: Record<string, any>) => {
  const schema = Joi.object({
    [Env.APP_NAME]: Joi.string().required(),
    [Env.HOST]: Joi.string().required(),
    [Env.PORT]: Joi.number().required(),
    db: Joi.object({
      type: Joi.string().required().valid('mysql'),
      host: Joi.string().required(),
      port: Joi.number().required().default(3306),
      username: Joi.string().required(),
      password: Joi.string().required(),
      database: Joi.string().required(),
      synchronize: Joi.boolean(),
      migrationsRun: Joi.boolean(),
      logging: Joi.array().items(Joi.string()).default(['error']),
    }).required()
  }).unknown(true)
  const { error, value } = schema.validate(config);
  if (error) {
    throw new Error(`配置校验失败: ${error.details.map(item => item.message).join(', ')}`);
  }
  return value
}
 
const yamlConfig = () => {
  const config = mergeConfig()
  return JoiSchema(config)
}

export default yamlConfig
