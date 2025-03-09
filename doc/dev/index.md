# 采用pnpm的monorepo
* monorepo的根目录下必须包含pnpm-workspace.yaml，用于指定分包是哪个文件夹，或者在根package.json中设定
* 在哪个目录下安装，就到哪个目录的package.json，安装是pnpm add xxx
* 如果pc依赖const，那么在pc的package.json里添加上"const": "workspace:*"，添加好后执行pnpm install，或者直接执行pnpm add const
* lodash 在根目录的 package.json 中定义pnpm add typescript -D -w，各个 package 不需要单独安装它。可以直接在代码中导入和使用 lodash import _ from 'lodash';

# tsconfig
* useDefineForClassFields 允许你在 TypeScript 代码中实验并采用即将成为标准的 JavaScript 类字段规范，确保在该标准广泛支持时能够顺利过渡。
* lib 选项允许你指定目标环境支持的 JavaScript 特性。例如，如果你的目标是 ES5，但你希望使用 ES6 的 Promise 类型，你可以通过 lib 选项显式包含 Promise 的类型定义。esnext：包含最新的 JavaScript 提案的全局类型
* skipLibCheck 是 TypeScript 编译器的一个选项，用于控制是否跳过对声明文件（.d.ts 文件）的类型检查。默认情况下，skipLibCheck 的值为 false，这意味着 TypeScript 会检查项目中所有的声明文件。
* esModuleInterop 启用 esModuleInterop 后，TypeScript 编译器会自动将 CommonJS 导出转换为 ES 模块的默认导出，从而实现无缝导入。
* allowSyntheticDefaultImports 是 TypeScript 编译器的一个选项，允许你从没有默认导出的模块中使用默认导入语法。这在处理某些第三方库时特别有用，这些库可能没有显式地定义默认导出，但你仍然希望使用默认导入语法来简化代码。
* strict 模式可以帮助你编写更健壮、更安全的代码，减少潜在的类型错误和运行时问题。比如必须初始化。
* forceConsistentCasingInFileNames 可以确保在不同操作系统上文件名的引用保持一致，避免因大小写不一致导致的错误。大小写区分。
* module 选项允许你指定目标环境支持的模块系统。esnext：生成 ES 模块代码，支持最新的 ES 提案特性。
* moduleResolution 指定模块解析策略，node：在当前目录和 node_modules 文件夹中查找模块。
* resolveJsonModule 允许你直接在 TypeScript 代码中导入 .json 文件。默认情况下，TypeScript 不允许直接导入 JSON 文件，因为 JSON 文件不包含类型信息。启用 resolveJsonModule 后，TypeScript 会自动为导入的 JSON 文件生成类型定义，从而使你能够以类型安全的方式使用 JSON 数据。
* isolatedModules 用于确保每个模块（通常是每个 TypeScript 文件）可以独立地进行编译，避免跨文件依赖。
* noEmit 用于控制是否生成编译后的输出文件。当设置为 true 时，TypeScript 编译器将执行类型检查并报告错误，但不会生成任何 JavaScript 输出文件。
* incremental 用于启用增量编译功能。增量编译是一种优化技术，它允许 TypeScript 编译器只重新编译自上次编译以来发生变化的文件，而不是每次重新编译整个项目。
* sourceMap 是 TypeScript 编译器的一个选项，用于生成源代码映射（Source Maps）。源代码映射是一种文件，它将编译后的代码（如 JavaScript）与原始源代码（如 TypeScript）之间的映射关系记录下来。这使得开发者可以在调试时看到原始的 TypeScript 代码，而不是编译后的 JavaScript 代码。

# mongodb

后台进程方式
// 启动
mongod --config /opt/homebrew/etc/mongod.conf --fork // macOS arm64，本文基于此命令
mongod --config /usr/local/etc/mongod.conf --fork // macOS x64 

ps aux | grep -v grep | grep mongod  // 查看 mongod 服务是否启动

查看当前数据库：db
显示数据库列表：show dbs
切换到指定数据库：use <database_name>
执行查询操作：db.<collection_name>.find()
插入文档：db.<collection_name>.insertOne({ ... })
更新文档：db.<collection_name>.updateOne({ ... })
删除文档：db.<collection_name>.deleteOne({ ... })
退出 MongoDB Shell：quit() 或者 exit

mongosh // 连接数据库
show dbs // 查看当前存在的数据库
db // 查看当前使用的数据库
use 数据库名称 // 切换数据库

mongosh // 启动MongoDB Shell，如果MongoDB服务器运行在本地默认端口（27017），则可以直接连接
mongosh --version // 查看mongo shell版本
mongosh --host <hostname>:<port> // MongoDB服务器运行在非默认端口或者远程服务器时的连接语法

* admin： 从权限的角度来看，这是root数据库。要是将一个用户添加到这个数据库，这个用户自动继承所有数据库的权限。一些特定的服务器端命令也只能从这个数据库运行，比如列出所有的数据库或者关闭服务器。
* config: 当Mongo用于分片设置时，config数据库在内部使用，用于保存分片的相关信息。
* local: 这个数据永远不会被复制，可以用来存储限于本地单台服务器的任意集合。

use 数据库名称 // 创建数据库

db.数据库名称.inserOne(document, options) // 往数据库的集合中插入单个文档

db.dropDatabase() // 删除数据库

说明：刚创建的数据库并不会在数据库的列表中展示， 要显示需要向新创建的数据库插入一些数据

文件大概是在
usr/local/etc/mongod.conf
但我们用我们自己的

用prisma连接mongodb必须启用mongodb的副本形式，
Prisma ORM 内部使用 MongoDB 事务来避免在嵌套查询中出现部分写操作。MongoDB 的事务功能仅在副本集模式下可用，因此 Prisma 需要 MongoDB 配置为副本集才能使用事务。这是mongodb的问题，要改动就必须要事务，要事务就必须副本。

mongo --username admin --password 1234 --authenticationDatabase admin

要先把认证注释掉

创建数据库
use bondma

创建用户
db.createUser({
  user: "admin",
  pwd: "1234",
  roles: [
    { role: "readWrite", db: "bondma" },
    { role: "userAdminAnyDatabase", db: "admin" }
  ]
})

副本集在第一次使用时还需要初始化：
rs.initiate()
这个最好在没有认证的时候处理

model文件创建完毕后，prisma还需要一行命令
npx prisma generate

mongod --config /Users/heroisuseless/Documents/GitHub/bondma/conf/mongo.conf
