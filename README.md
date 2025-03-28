# Bondma - Multilingual Translation Management Platform
[中文文档](./doc/readme/zh.md)

## Project Overview

Bondma is a modern multilingual translation management platform designed to simplify the internationalization (i18n) process for applications and websites. It provides an intuitive user interface to help teams efficiently manage, translate, and synchronize multilingual content.

![Bondma Main](./doc/readme/main.png)

![Bondma Page](./doc/readme/index.png)

## Key Features

- **Team Collaboration**: Supports multiple team members collaborating on translation projects with role-based permission management
- **Multi-language Support**: Add unlimited languages, supporting all major languages
- **Import/Export**: Support for importing and exporting in various formats including JSON, CSV, YAML, XML, etc.
- **Version Control**: Track content change history to ensure translation consistency
- **API Integration**: Provides REST API for seamless integration with CI/CD workflows
- **Secure and Reliable**: Encrypted data storage with secure access control

## Tech Stack

- **Frontend**: Next.js, React, TailwindCSS, Jotai
- **Backend**: NestJS, MongoDB
- **Deployment**: Docker, Kubernetes

## Quick Start
```
pnpm i
```

```
mongod --config /Users/heroisuseless/Documents/GitHub/bondma/conf/mongo.conf
```

```
cd packages/server
pnpm run start
```

```
cd packages/web
pnpm run dev
```

### Prerequisites

- Node.js 18+
- MongoDB 14+
- Docker (optional)

### Contact

![weixin](./doc/readme/weixin.jpg)
![qq](./doc/readme/qq.png)

### Donation

![prize](./doc/readme/prize.jpg)

![Bondma Logo](./doc/readme/dollar.jpg)
