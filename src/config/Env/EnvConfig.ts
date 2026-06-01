import { ConfigModule } from '@nestjs/config';
import yamlConfig from './yamlConfig';
const EnvConfigModule = ConfigModule.forRoot({
  isGlobal: true,
  load: [yamlConfig],
});

export default EnvConfigModule;