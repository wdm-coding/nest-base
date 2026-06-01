# nest-server

## nestjs 项目创建
  `npx @nestjs/cli new nest-base --strict`

## 项目方案清单

### module 模块管理
  1. 快速创建模块 `npx nest g resource modules/xxx`

### 路径别名配置
  1. `npm install --save-dev tsconfig-paths` 开发环境配置路径别名
  2. 生产环境配置路径别名直接使用SWC编译器即可(nest-cli.json中配置builder为swc)

### 环境管理(最终采用js-yaml方案)
  + `npm install @nestjs/config` nestjs获取环境变量模块
  + `npm install -D cross-env` `解决跨平台环境变量配置问题`

  1. 基于 .env 文件的方案
  2. 基于js-yaml文件的方案
    + `npm install js-yaml`  解析 yaml 文件
    + `npm install -D @types/js-yaml` 
    + `npm install lodash`  深度合并对象
    + `npm install -D @types/lodash`
    + `npm install --save joi`  配置数据验证模块

### 数据库管理(最终采用TypeORM 方案)
1. MySQL + TypeORM
  + `npm install mysql2`  mysql2 模块
  + `npm install @nestjs/typeorm`  nestjs的TypeORM 模块
  + `npm install typeorm`  TypeORM 模块
  + `npm install ts-node --save-dev`  用于直接运行migrationsd中的ts文件
  + `npm run migration:generate -- src/migrations/init-db-01`  生成数据库迁移文件
  + `npm run migration:run`  执行数据库迁移
  
2. MySQL + Prisma

### DTO数据验证
+ class-validator `npm install class-validator` 负责验证数据的有效性
+ class-transformer `npm install class-transformer` 负责数据类型的转换和对象结构的构建

### 日志管理(最终采用Pino 方案)
1. Pino + nestjs-pino
  + `npm install nestjs-pino`  estJS 的适配库
  + `npm install pino-http`  HTTP 请求日志中间件
  + `npm install --save-dev pino-pretty`  日志格式化模块
  + `npm install pino-roll` 输出 JSON 日志到文件

2. Winston + nest-winston

### 全局异常过滤器
+ 捕获所有异常并记录日志
+ 处理异常并返回统一的响应格式

### 全局响应拦截器
+ 统一格式化响应数据

### 加密模块
+ `npm install bcrypt`  加密模块
+ `npm install -D @types/bcrypt`

### 安全认证
1. JWT
  + `npm install @nestjs/jwt`  Nest 官方封装的 JWT 工具包，专门用来 签发 token。
  + `npm install @nestjs/passport`  让 passport 能在 Nest 里用（模块化、依赖注入、Guard 整合）
  + `npm install passport-jwt`  解析 token、验证签名、判断是否过期
  + `npm install passport`  登录鉴权底层框架
2. RBAC 权限



### Redis 缓存
+ `npm install ioredis`  底层高性能的 Node.js Redis 客户端

## 项目设置
1. 安装依赖
```bash
$ npm install
```

## 启动运行
```bash
# 1. 开发模式
$ npm run start

# 2. 监听模式
# 开发环境监听模式
$ npm run start:dev

# 3. 生产模式
$ npm run start:prod
```

## 项目测试

```bash
# 1. 单元测试
$ npm run test

# 2. 端到端测试
$ npm run test:e2e

# 3. 测试覆盖率报告
$ npm run test:cov
```
