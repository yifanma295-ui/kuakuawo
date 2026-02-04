# 🌐 Vercel 部署完整操作指南

**目标：** 部署前端 Web 版 + 后端 API 到 Vercel，获得两个可用的域名链接

**预期结果：**
- 前端用户应用：`https://kuakuawo.vercel.app`
- 管理员后台：`https://kuakuawo.vercel.app/admin`
- 后端 API：`https://kuakuawo-api.vercel.app`

---

## 📋 准备工作清单

在开始之前，请确保您有：

- ✅ GitHub 账户：`yifanma295-ui`
- ✅ Vercel 账户（用 GitHub 登陆）
- ✅ 一个文本编辑器（记录关键信息）

**需要获取的信息：**
- [ ] GitHub 仓库 HTTPS 链接（创建后获取）
- [ ] Neon 数据库连接字符串（创建后获取）
- [ ] 管理员密码（您自己设置）

---

## 🔧 第 1 步：在 GitHub 创建公开仓库

### 1.1 登录 GitHub

1. 打开浏览器，访问 https://github.com
2. 点击右上角您的头像
3. 如果未登录，点击 "Sign in"，输入用户名 `yifanma295-ui` 和密码

### 1.2 创建新仓库

1. 登录后，点击右上角的 **"+"** 图标
2. 选择 **"New repository"**

### 1.3 填写仓库信息

| 字段 | 填写内容 | 说明 |
|------|--------|------|
| **Repository name** | `kuakuawo` | 仓库名称 |
| **Description** | `AI夸奖应用 - 做用户的挚友` | 可选 |
| **Public/Private** | **Public** | 必须是公开的 |
| **Add a README file** | ✅ 勾选 | 添加 README |
| **.gitignore template** | **Node** | 忽略 node_modules |
| **Choose a license** | **MIT License** | 开源协议 |

### 1.4 点击 "Create repository"

### 1.5 复制仓库链接

1. 创建成功后，点击绿色的 **"Code"** 按钮
2. 复制 HTTPS 链接：`https://github.com/yifanma295-ui/kuakuawo.git`
3. **保存这个链接！**

---

## 🗄️ 第 2 步：在 Neon 创建 PostgreSQL 数据库

### 2.1 访问 Neon 官网

1. 打开浏览器，访问 https://neon.tech
2. 点击右上角的 **"Sign Up"** 或 **"Sign in"**

### 2.2 用 GitHub 账户登录

1. 点击 **"Continue with GitHub"**
2. 授权 Neon 访问您的 GitHub 账户
3. 完成登录

### 2.3 创建新项目

1. 登录后，点击 **"New Project"** 或 **"Create Project"**

### 2.4 配置数据库参数

| 参数 | 选择 | 说明 |
|------|------|------|
| **PostgreSQL Version** | **17** | ✅ 最新版本，完全 OK |
| **Cloud Service Provider** | **AWS** | 全球部署最广 |
| **Region** | **us-east-1** | 最稳定，中国连接快 |
| **Enable Neon Auth** | ❌ 不勾选 | 我们用自己的认证 |

### 2.5 点击 "Create Project"

等待项目创建完成（约 30 秒）

### 2.6 获取数据库连接字符串

1. 项目创建完成后，您会看到连接信息
2. 复制整个连接字符串（以 `postgresql://` 开头）
3. **保存这个连接字符串！**

示例：
```
postgresql://user:password@host/database?sslmode=require
```

---

## 🚀 第 3 步：部署后端到 Vercel

### 3.1 访问 Vercel

1. 打开浏览器，访问 https://vercel.com
2. 点击右上角的 **"Log in"**
3. 选择 **"Continue with GitHub"**
4. 授权并登录

### 3.2 导入项目

1. 登录 Vercel 后，点击 **"Add New"** 按钮（左侧菜单）
2. 选择 **"Project"**

### 3.3 从 GitHub 导入

1. 在 "Import Git Repository" 页面
2. 在搜索框中输入：`kuakuawo`
3. 找到 `yifanma295-ui/kuakuawo`
4. 点击 **"Import"**

### 3.4 配置项目

| 设置项 | 操作 |
|-------|------|
| **Project Name** | 改为 `kuakuawo-api` |
| **Framework Preset** | 选择 **"Other"** |
| **Root Directory** | 保持默认 |

### 3.5 添加环境变量（最关键！）

1. 向下滚动，找到 **"Environment Variables"** 部分
2. 点击 **"Add"** 按钮

#### 添加第 1 个变量：DATABASE_URL

| 字段 | 内容 |
|------|------|
| **Name** | `DATABASE_URL` |
| **Value** | 粘贴您从 Neon 复制的连接字符串 |
| **Environments** | ✅ Production, ✅ Preview, ✅ Development |

点击 **"Add"** 保存

#### 添加第 2 个变量：ADMIN_PASSWORD

| 字段 | 内容 |
|------|------|
| **Name** | `ADMIN_PASSWORD` |
| **Value** | 您想设置的密码，比如 `admin123456` |
| **Environments** | ✅ Production, ✅ Preview, ✅ Development |

点击 **"Add"** 保存

#### 添加第 3 个变量：DEEPSEEK_API_KEY（如果有）

如果您有 DeepSeek API 密钥：

| 字段 | 内容 |
|------|------|
| **Name** | `DEEPSEEK_API_KEY` |
| **Value** | 您的 DeepSeek API 密钥 |
| **Environments** | ✅ Production, ✅ Preview, ✅ Development |

点击 **"Add"** 保存

### 3.6 部署

1. 确认所有环境变量都已添加
2. 点击 **"Deploy"** 按钮
3. 等待部署完成（2-5 分钟）

### 3.7 获取后端域名

1. 部署完成后，您会看到 "Congratulations!" 页面
2. 复制显示的域名，通常是：`https://kuakuawo-api.vercel.app`
3. **保存这个域名！后面会用到**

---

## 🎨 第 4 步：部署前端到 Vercel

### 4.1 创建第二个 Vercel 项目

1. 在 Vercel 首页，点击 **"Add New"** → **"Project"**
2. 同样从 GitHub 导入 `kuakuawo` 仓库

### 4.2 配置前端项目

| 设置项 | 操作 |
|-------|------|
| **Project Name** | 改为 `kuakuawo` |
| **Framework Preset** | 选择 **"Next.js"** 或 **"Other"** |
| **Root Directory** | 保持默认 |

### 4.3 添加环境变量

1. 找到 **"Environment Variables"** 部分
2. 点击 **"Add"**

#### 添加变量：EXPO_PUBLIC_API_URL

| 字段 | 内容 |
|------|------|
| **Name** | `EXPO_PUBLIC_API_URL` |
| **Value** | 您从第 3 步获得的后端域名，比如 `https://kuakuawo-api.vercel.app` |
| **Environments** | ✅ Production, ✅ Preview, ✅ Development |

点击 **"Add"** 保存

### 4.4 部署

1. 确认环境变量已添加
2. 点击 **"Deploy"** 按钮
3. 等待部署完成

### 4.5 获取前端域名

部署完成后，您会获得前端域名：`https://kuakuawo.vercel.app`

**这就是您可以分享到微信、小红书的链接！**

---

## ✅ 第 5 步：验证部署

### 5.1 测试前端应用

1. 打开浏览器，访问：`https://kuakuawo.vercel.app`
2. 您应该看到夸夸我应用的首页
3. 尝试生成一条夸奖
4. **确认收到定制化夸奖（不是通用模板）**

### 5.2 测试管理员后台

1. 打开浏览器，访问：`https://kuakuawo.vercel.app/admin`
2. 输入您在第 3 步设置的管理员密码（比如 `admin123456`）
3. 您应该看到统计数据：
   - 访客数（UV）
   - 页面浏览量（PV）
   - 用户昵称
   - 生成的夸奖
   - 主题点击统计

### 5.3 测试 API 连接

1. 在前端应用中生成一条夸奖
2. 打开浏览器开发者工具（F12）
3. 切换到 "Network" 标签
4. 查看是否有 API 调用（应该看到状态码 200）

---

## 🎯 最终成果

完成以上步骤后，您将拥有：

| 项目 | 链接 | 用途 |
|------|------|------|
| **前端用户应用** | `https://kuakuawo.vercel.app` | 用户使用，可分享 |
| **管理员后台** | `https://kuakuawo.vercel.app/admin` | 查看统计数据 |
| **后端 API** | `https://kuakuawo-api.vercel.app` | 后端服务 |
| **GitHub 仓库** | `https://github.com/yifanma295-ui/kuakuawo` | 源代码 |

---

## 🆘 常见问题

### Q1：部署失败，显示 "Build failed"

**解决方案：**
1. 检查 `DATABASE_URL` 是否正确复制（没有多余空格）
2. 查看 Vercel 的 "Build Logs"，找到具体错误信息
3. 如果是代码问题，告诉我错误信息

### Q2：前端无法连接到后端 API

**解决方案：**
1. 确保 `EXPO_PUBLIC_API_URL` 指向正确的后端域名
2. 检查后端是否正常运行（访问后端域名看是否有响应）
3. 打开浏览器 Console（F12），查看错误信息

### Q3：管理员后台显示 "密码错误"

**解决方案：**
1. 确认您输入的密码与设置的 `ADMIN_PASSWORD` 一致
2. 如果忘记了，在 Vercel 中修改 `ADMIN_PASSWORD`，然后重新部署

### Q4：数据库连接失败

**解决方案：**
1. 检查 `DATABASE_URL` 是否正确
2. 在 Neon 中重新生成连接字符串
3. 在 Vercel 中更新 `DATABASE_URL`，然后重新部署

---

## 📝 关键信息记录表

请保存以下信息，后面会用到：

| 信息 | 内容 | 来源 |
|------|------|------|
| GitHub 仓库链接 | `https://github.com/yifanma295-ui/kuakuawo.git` | 第 1 步 |
| Neon 连接字符串 | `postgresql://...` | 第 2 步 |
| 管理员密码 | `admin123456` | 第 3 步（您设置） |
| 后端域名 | `https://kuakuawo-api.vercel.app` | 第 3 步 |
| 前端域名 | `https://kuakuawo.vercel.app` | 第 4 步 |

---

**现在就可以开始部署了！按照上面的步骤一步步操作。有任何问题随时告诉我！** 🚀
