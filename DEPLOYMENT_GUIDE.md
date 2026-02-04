# 🚀 夸夸我 App 完整发布指南

**目标：** 将应用发布到 GitHub 和 Vercel，获得两个可用的域名链接
- 前端用户应用：`https://kuakuawo.vercel.app`（可分享到微信、小红书）
- 管理员后台：`https://kuakuawo.vercel.app/admin`（查看统计数据）

---

## 📋 准备工作

在开始之前，请确保您有以下账户：
- ✅ GitHub 账户：`yifanma295-ui`
- ✅ Vercel 账户：用 GitHub 直接登陆
- ✅ 一个文本编辑器（记录关键信息）

---

## 🔧 第 1 阶段：在 GitHub 创建公开仓库

### 步骤 1.1：登录 GitHub

1. 打开浏览器，访问 https://github.com
2. 点击右上角您的头像
3. 点击 "Sign in"（如果未登录）
4. 输入用户名 `yifanma295-ui` 和密码登录

### 步骤 1.2：创建新仓库

1. 登录后，点击右上角的 **"+"** 图标
2. 选择 **"New repository"**

![GitHub 新建仓库位置](https://user-images.githubusercontent.com/xxx/xxx.png)

### 步骤 1.3：填写仓库信息

在新页面中填写以下信息：

| 字段 | 填写内容 | 说明 |
|------|--------|------|
| **Repository name** | `kuakuawo` | 仓库名称，不能有中文 |
| **Description** | `AI夸奖应用 - 做用户的挚友` | 可选，仓库描述 |
| **Public/Private** | 选择 **Public** | 必须是公开的，Vercel 才能访问 |
| **Add a README file** | ✅ 勾选 | 添加 README 文件 |
| **.gitignore template** | 选择 **Node** | 忽略 node_modules 等文件 |
| **Choose a license** | 选择 **MIT License** | 开源协议 |

### 步骤 1.4：创建仓库

点击绿色的 **"Create repository"** 按钮

### 步骤 1.5：复制仓库链接

创建成功后，您会看到仓库页面。点击绿色的 **"Code"** 按钮，复制 HTTPS 链接：

```
https://github.com/yifanma295-ui/kuakuawo.git
```

**保存这个链接，后面会用到！**

---

## 🗄️ 第 2 阶段：在 Neon 创建 PostgreSQL 数据库

### 步骤 2.1：访问 Neon 官网

1. 打开浏览器，访问 https://neon.tech
2. 点击右上角的 **"Sign Up"** 或 **"Sign in"**

### 步骤 2.2：用 GitHub 账户登录

1. 在登录页面，点击 **"Continue with GitHub"**
2. 授权 Neon 访问您的 GitHub 账户
3. 完成登录

### 步骤 2.3：创建新项目

1. 登录后，点击 **"New Project"** 或 **"Create Project"**
2. 进入项目创建页面

### 步骤 2.4：配置数据库参数

在项目创建页面，您会看到以下选项：

#### **PostgreSQL Version（PostgreSQL 版本）**
- 显示为 **17** ✅ **这是 OK 的！**
- 17 是最新版本，完全支持，无需更改

#### **Cloud Service Provider（云服务提供商）**
- 选项：AWS 或 Azure
- **建议选择：AWS**（原因：AWS 在全球部署最广，中国大陆连接速度更快）

#### **Region（地区）**
- 如果选择 AWS，会显示多个地区选项
- **建议选择：`us-east-1`**（原因：这是最稳定的区域，中国大陆连接也很快）
- 或者选择离您最近的地区

#### **Enable Neon Auth（启用 Neon 身份验证）**
- 这是一个可选功能，用于 Neon 自己的身份验证系统
- **建议：不勾选 ❌**（我们用自己的管理员密码认证，不需要 Neon Auth）

### 步骤 2.5：创建项目

1. 点击 **"Create Project"** 按钮
2. 等待项目创建完成（通常需要 30 秒左右）

### 步骤 2.6：获取数据库连接字符串

项目创建完成后，您会看到一个页面，上面显示连接信息：

```
postgresql://user:password@host/database?sslmode=require
```

**重要：复制整个连接字符串！** 这就是 `DATABASE_URL`

**保存这个连接字符串，后面会用到！**

---

## 🌐 第 3 阶段：部署后端到 Vercel

### 步骤 3.1：访问 Vercel

1. 打开浏览器，访问 https://vercel.com
2. 点击右上角的 **"Log in"**
3. 选择 **"Continue with GitHub"**
4. 授权并登录

### 步骤 3.2：导入项目

1. 登录 Vercel 后，点击 **"Add New"** 按钮（左侧菜单或顶部）
2. 选择 **"Project"**

### 步骤 3.3：从 GitHub 导入

1. 在 "Import Git Repository" 页面
2. 在搜索框中输入：`kuakuawo`
3. 找到您刚创建的仓库 `yifanma295-ui/kuakuawo`
4. 点击 **"Import"**

### 步骤 3.4：配置项目

在项目配置页面，您会看到：

| 设置项 | 操作 |
|-------|------|
| **Project Name** | 改为 `kuakuawo-api`（后端项目名） |
| **Framework Preset** | 选择 **"Other"** |
| **Root Directory** | 保持默认 |

### 步骤 3.5：添加环境变量

这是**最关键的一步**！

1. 向下滚动，找到 **"Environment Variables"** 部分
2. 点击 **"Add"** 按钮，添加以下变量：

#### 变量 1：DATABASE_URL

| 字段 | 内容 |
|------|------|
| **Name** | `DATABASE_URL` |
| **Value** | 粘贴您从 Neon 复制的连接字符串 |
| **Environments** | 勾选 Production, Preview, Development |

#### 变量 2：ADMIN_PASSWORD

| 字段 | 内容 |
|------|------|
| **Name** | `ADMIN_PASSWORD` |
| **Value** | 您想设置的管理员密码，比如 `admin123456` |
| **Environments** | 勾选 Production, Preview, Development |

#### 变量 3：DEEPSEEK_API_KEY（如果有）

| 字段 | 内容 |
|------|------|
| **Name** | `DEEPSEEK_API_KEY` |
| **Value** | 您的 DeepSeek API 密钥（如果没有，跳过这一步） |
| **Environments** | 勾选 Production, Preview, Development |

### 步骤 3.6：部署

1. 确认所有环境变量都已添加
2. 点击 **"Deploy"** 按钮
3. 等待部署完成（通常需要 2-5 分钟）

### 步骤 3.7：获取后端域名

部署完成后：

1. 您会看到一个成功页面，显示 **"Congratulations! Your project has been successfully deployed"**
2. 点击 **"Visit"** 按钮或复制显示的域名
3. 后端域名通常是：`https://kuakuawo-api.vercel.app`

**保存这个域名，后面会用到！**

---

## 🎨 第 4 阶段：部署前端到 Vercel

### 步骤 4.1：创建第二个 Vercel 项目

1. 在 Vercel 首页，再次点击 **"Add New"** → **"Project"**
2. 同样从 GitHub 导入 `kuakuawo` 仓库

### 步骤 4.2：配置前端项目

| 设置项 | 操作 |
|-------|------|
| **Project Name** | 改为 `kuakuawo`（前端项目名） |
| **Framework Preset** | 选择 **"Next.js"** 或 **"Other"** |
| **Root Directory** | 保持默认 |

### 步骤 4.3：添加环境变量

1. 找到 **"Environment Variables"** 部分
2. 点击 **"Add"**，添加以下变量：

#### 变量 1：EXPO_PUBLIC_API_URL

| 字段 | 内容 |
|------|------|
| **Name** | `EXPO_PUBLIC_API_URL` |
| **Value** | 您从第 3 阶段获得的后端域名，比如 `https://kuakuawo-api.vercel.app` |
| **Environments** | 勾选 Production, Preview, Development |

### 步骤 4.4：部署

1. 确认环境变量已添加
2. 点击 **"Deploy"** 按钮
3. 等待部署完成

### 步骤 4.5：获取前端域名

部署完成后，您会获得前端域名，通常是：`https://kuakuawo.vercel.app`

**这就是您可以分享到微信、小红书的链接！**

---

## ✅ 第 5 阶段：验证部署

### 步骤 5.1：测试前端应用

1. 打开浏览器，访问：`https://kuakuawo.vercel.app`
2. 您应该看到夸夸我应用的首页
3. 尝试生成一条夸奖，确保能正常工作

### 步骤 5.2：测试管理员后台

1. 打开浏览器，访问：`https://kuakuawo.vercel.app/admin`
2. 输入您在第 3 阶段设置的管理员密码
3. 您应该看到统计数据（访客数、用户昵称、生成的夸奖等）

### 步骤 5.3：测试 API 连接

1. 打开浏览器开发者工具（F12）
2. 打开前端应用，生成一条夸奖
3. 在 Console 中查看是否有错误
4. 检查 Network 标签，确保 API 调用成功（状态码 200）

---

## 🎯 最终成果

完成以上步骤后，您将拥有：

| 项目 | 链接 | 用途 |
|------|------|------|
| **前端用户应用** | `https://kuakuawo.vercel.app` | 用户使用的应用，可分享到微信、小红书 |
| **管理员后台** | `https://kuakuawo.vercel.app/admin` | 查看访客数、用户昵称、生成的夸奖、主题统计等 |
| **GitHub 仓库** | `https://github.com/yifanma295-ui/kuakuawo` | 源代码存储 |
| **后端 API** | `https://kuakuawo-api.vercel.app` | 后端服务（用户不需要直接访问） |

---

## 🆘 常见问题

### Q1：部署失败，显示 "Build failed"

**原因：** 通常是环境变量配置错误或代码有问题

**解决方案：**
1. 检查 `DATABASE_URL` 是否正确复制
2. 查看 Vercel 的 Build Logs，找到具体错误信息
3. 如果是代码问题，我会帮您修复

### Q2：前端无法连接到后端 API

**原因：** `EXPO_PUBLIC_API_URL` 配置错误

**解决方案：**
1. 确保 `EXPO_PUBLIC_API_URL` 指向正确的后端域名
2. 检查后端是否正常运行（访问后端域名看是否有响应）
3. 检查浏览器 Console 中的错误信息

### Q3：管理员后台显示 "密码错误"

**原因：** 输入的密码与 `ADMIN_PASSWORD` 不匹配

**解决方案：**
1. 确认您输入的密码与第 3 阶段设置的 `ADMIN_PASSWORD` 一致
2. 如果忘记了密码，在 Vercel 中修改 `ADMIN_PASSWORD` 环境变量，然后重新部署

### Q4：数据库连接失败

**原因：** `DATABASE_URL` 过期或网络问题

**解决方案：**
1. 在 Neon 中重新生成连接字符串
2. 在 Vercel 中更新 `DATABASE_URL`
3. 重新部署项目

---

## 📞 需要帮助？

如果遇到任何问题，请：
1. 查看 Vercel 的 Build Logs 和 Runtime Logs
2. 检查浏览器 Console 中的错误信息
3. 告诉我具体的错误信息，我会帮您排查

---

**准备好开始了吗？请按照上面的步骤一步步操作，有任何问题随时告诉我！** 🚀
