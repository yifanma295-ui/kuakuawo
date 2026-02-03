# 夸夸我 App - GitHub + Vercel 部署指引

## 📋 前置准备

在开始部署前，请确保您已准备好以下信息：

1. **GitHub 账号**：用于存储代码
2. **Vercel 账号**：用于部署应用（可通过 GitHub 账号登录）
3. **环境变量**：
   - `DEEPSEEK_API_KEY`：DeepSeek API 密钥
   - `DATABASE_URL`：PostgreSQL 数据库连接字符串
   - `ADMIN_PASSWORD`：管理后台密码（默认：`kuakuawo2024`）

---

## 🚀 部署步骤

### 第一步：初始化 Git 仓库并推送到 GitHub

在您的本地电脑上执行以下命令：

```bash
# 1. 克隆或进入项目目录
cd /path/to/kuakuawo

# 2. 初始化 Git 仓库（如果还未初始化）
git init

# 3. 添加所有文件
git add .

# 4. 提交代码
git commit -m "Initial commit: 夸夸我 App - H5 版本"

# 5. 添加远程仓库（替换 YOUR_USERNAME 和 REPO_NAME）
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# 6. 推送到 GitHub
git branch -M main
git push -u origin main
```

**获取您的 GitHub 仓库 URL**：
- 登录 GitHub：https://github.com
- 创建新仓库：点击右上角 `+` → `New repository`
- 填写仓库名称（例如：`kuakuawo`）
- 选择 `Public`（公开）
- 点击 `Create repository`
- 复制仓库 URL（形如：`https://github.com/YOUR_USERNAME/kuakuawo.git`）

---

### 第二步：在 Vercel 中部署

1. **访问 Vercel**：https://vercel.com
2. **使用 GitHub 账号登录**
3. **导入项目**：
   - 点击 `Add New...` → `Project`
   - 选择 `Import Git Repository`
   - 选择您刚才推送的 `kuakuawo` 仓库
   - 点击 `Import`

4. **配置环境变量**：
   - 在 `Environment Variables` 部分，添加以下变量：
     - `DEEPSEEK_API_KEY`：您的 DeepSeek API 密钥
     - `DATABASE_URL`：您的 PostgreSQL 连接字符串
     - `ADMIN_PASSWORD`：管理后台密码
   - 点击 `Add`

5. **部署**：
   - 点击 `Deploy` 按钮
   - 等待部署完成（通常需要 2-5 分钟）

---

## 📍 获取部署后的域名

部署完成后，您会看到以下信息：

### 前端 H5 应用
- **主域名**：`https://kuakuawo.vercel.app`（Vercel 自动生成）
- **自定义域名**：您可以在 Vercel 项目设置中绑定自己的域名（如 `kuakuawo.com`）

### 后端管理后台
- **访问地址**：`https://kuakuawo.vercel.app/admin-secret`
- **默认密码**：`kuakuawo2024`

---

## 🔧 环境变量配置详解

### DEEPSEEK_API_KEY
- **获取方式**：访问 https://platform.deepseek.com
- **格式**：`sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### DATABASE_URL
- **获取方式**：使用 Vercel Postgres 或自己的 PostgreSQL 数据库
- **格式**：`postgresql://user:password@host:port/database`
- **Vercel Postgres 推荐**：
  1. 在 Vercel 项目中点击 `Storage` → `Create Database`
  2. 选择 `Postgres`
  3. 复制 `POSTGRES_URL_NON_POOLING` 的值

### ADMIN_PASSWORD
- **用途**：保护管理后台 `/admin-secret` 页面
- **建议**：使用强密码（至少 8 个字符，包含大小写字母和数字）

---

## 🌐 自定义域名（可选）

如果您想使用自己的域名（如 `kuakuawo.com`）：

1. **在 Vercel 中添加域名**：
   - 打开 Vercel 项目设置
   - 点击 `Domains`
   - 输入您的域名
   - 按照指示配置 DNS 记录

2. **配置 DNS**：
   - 登录您的域名提供商（如阿里云、腾讯云等）
   - 添加 CNAME 记录，指向 Vercel 提供的地址
   - 等待 DNS 生效（通常 15-30 分钟）

---

## 📊 监控和维护

### 查看部署日志
- 在 Vercel 项目中点击 `Deployments`
- 选择最新的部署版本
- 查看 `Logs` 标签页

### 更新代码
每当您在 GitHub 中推送新代码时，Vercel 会自动触发新的部署：

```bash
# 在本地修改代码后
git add .
git commit -m "Update: 新增功能描述"
git push origin main
```

### 查看应用数据
- 访问管理后台：`https://your-domain/admin-secret`
- 输入密码：`kuakuawo2024`
- 查看实时用户数据、埋点统计等

---

## ❓ 常见问题

### Q: 部署后访问显示 404？
**A**: 检查 `vercel.json` 中的 `rewrites` 配置是否正确，确保所有路由都被正确转发。

### Q: 管理后台无法访问？
**A**: 确保您已正确设置 `ADMIN_PASSWORD` 环境变量，并使用正确的密码登录。

### Q: 数据库连接失败？
**A**: 检查 `DATABASE_URL` 是否正确，确保数据库服务器允许来自 Vercel 的连接。

### Q: 如何回滚到之前的版本？
**A**: 在 Vercel 的 `Deployments` 页面中，找到之前的版本，点击 `Redeploy`。

---

## 📞 技术支持

如有问题，请：
1. 查看 Vercel 官方文档：https://vercel.com/docs
2. 查看项目 README：查看项目根目录的 README.md
3. 检查部署日志中的错误信息

---

**祝部署顺利！🎉**
