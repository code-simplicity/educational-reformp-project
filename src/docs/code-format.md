# 代码格式化指南

本项目使用 ESLint 和 Prettier 进行代码格式化和质量检查，确保代码风格的一致性和质量。

## 安装的工具

- **Prettier**: 代码格式化工具
- **ESLint**: 代码质量检查工具 (v9.28.0)
- **@eslint/js**: ESLint v9 的核心 JavaScript 规则集
- **eslint-plugin-vue**: ESLint 的 Vue 插件
- **eslint-config-prettier**: 禁用 ESLint 中与 Prettier 冲突的规则
- **eslint-plugin-prettier**: 将 Prettier 作为 ESLint 规则运行
- **vue-eslint-parser**: Vue 文件的 ESLint 解析器
- **husky**: Git 钩子管理工具
- **lint-staged**: 对暂存的文件运行脚本

## 配置文件

- **.prettierrc.js**: Prettier 配置文件，定义了代码格式化规则
- **eslint.config.js**: ESLint 配置文件（ESLint v9.0.0 新格式），定义了代码质量检查规则
- **package.json**: 包含 lint-staged 配置和脚本命令

> **注意**: 从 ESLint v9.0.0 开始，默认配置文件从 `.eslintrc.*` 变更为 `eslint.config.js`，采用了新的扁平配置格式。

## 代码风格规则

本项目的代码风格规则如下：

- 使用制表符（tab）进行缩进
- 使用单引号
- 不在对象和数组的最后一个元素后面添加逗号
- 使用分号结束语句
- 行宽为 100 个字符
- Vue 文件中的 script 和 style 标签内的代码不缩进

## 使用方法

### 手动格式化代码

```bash
# 格式化所有 JavaScript 和 Vue 文件
yarn format

# 运行 ESLint 检查代码
yarn lint

# 运行 ESLint 并自动修复问题
yarn lint:fix
```

### 自动格式化

本项目配置了 Git 钩子，会在提交代码前自动运行 ESLint 和 Prettier，确保提交的代码符合格式要求。

## 编辑器集成

### VS Code

推荐在 VS Code 中安装以下插件：

- ESLint
- Prettier - Code formatter

并在设置中启用保存时格式化：

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

### WebStorm / IntelliJ IDEA

在 WebStorm 或 IntelliJ IDEA 中：

1. 转到 Preferences > Languages & Frameworks > JavaScript > Prettier
2. 勾选 "On save"
3. 转到 Preferences > Languages & Frameworks > JavaScript > Code Quality Tools > ESLint
4. 勾选 "Automatic ESLint configuration" 和 "Run eslint --fix on save"

## ESLint 配置迁移说明

从 ESLint v9.0.0 开始，ESLint 引入了新的扁平配置格式，默认配置文件从 `.eslintrc.*` 变更为 `eslint.config.js`。本项目已完成此迁移，主要变更如下：

1. 创建了新的 `eslint.config.js` 文件，使用扁平配置格式
2. 安装了新的依赖 `@eslint/js`，提供核心 JavaScript 规则集
3. 配置结构从嵌套对象变为数组形式
4. 环境变量、解析器选项等配置方式有所调整

如需了解更多关于 ESLint v9 扁平配置的信息，请参考 [ESLint 官方文档](https://eslint.org/docs/latest/use/configure/configuration-files)。

## 注意事项

- 如果你需要临时禁用 ESLint 规则，可以使用 `// eslint-disable-next-line` 或 `/* eslint-disable */` 注释
- 如果你需要临时禁用 Prettier 规则，可以使用 `// prettier-ignore` 注释
- 如果你需要跳过 Git 钩子，可以使用 `git commit --no-verify` 命令
