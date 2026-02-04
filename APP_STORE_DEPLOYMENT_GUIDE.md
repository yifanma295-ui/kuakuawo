# 📱 App Store 发布完整操作指南

**目标：** 将夸夸我 App 发布到 Apple App Store，让用户可以下载安装

**预期结果：**
- iOS 用户可以在 App Store 搜索 "夸夸我" 并下载
- 用户收到定制化的 AI 夸奖（不再有 Expo Go 的网络问题）
- 所有数据同步到后端数据库

---

## 📋 准备工作清单

### 前置条件

- ✅ 已完成 Vercel 部署（前端 + 后端）
- ✅ 已验证前端应用和管理员后台正常运行
- ✅ 有一个 Apple ID（用于 App Store Connect）
- ✅ 有一个 Mac 电脑（推荐，用于生成证书）或 Windows/Linux（也可以，但需要额外配置）

### 需要购买/创建

- [ ] Apple Developer Program 账户（$99/年）
- [ ] App Store Connect 应用
- [ ] 应用图标（1024x1024）
- [ ] 应用截图（5-10 张）
- [ ] 隐私政策 URL

---

## 💳 第 1 步：注册 Apple Developer Program

### 1.1 访问 Apple Developer

1. 打开浏览器，访问 https://developer.apple.com
2. 点击右上角 **"Account"**
3. 点击 **"Enroll"**

### 1.2 选择账户类型

| 类型 | 费用 | 推荐 |
|------|------|------|
| **Individual** | $99/年 | ✅ 个人推荐 |
| **Organization** | $99/年 | 公司推荐 |
| **Government** | 免费 | 政府机构 |
| **Educational** | 免费 | 教育机构 |

选择 **"Individual"**

### 1.3 填写个人信息

1. 输入您的 Apple ID（或创建新的）
2. 填写个人信息（姓名、地址等）
3. 同意条款和条件
4. 点击 **"Continue"**

### 1.4 支付年费

1. 选择支付方式（信用卡、Apple Pay 等）
2. 支付 $99
3. 完成注册

### 1.5 等待审核

- Apple 通常需要 **1-2 天** 审核您的申请
- 审核通过后，您会收到邮件通知

---

## 🆔 第 2 步：创建 App ID

### 2.1 访问 Apple Developer 控制台

1. 登录 https://developer.apple.com
2. 点击 **"Account"**
3. 点击 **"Certificates, Identifiers & Profiles"**

### 2.2 创建 App ID

1. 在左侧菜单，点击 **"Identifiers"**
2. 点击右上角的 **"+"** 按钮
3. 选择 **"App IDs"**
4. 点击 **"Continue"**

### 2.3 选择类型

选择 **"App"**，点击 **"Continue"**

### 2.4 填写信息

| 字段 | 填写内容 | 说明 |
|------|--------|------|
| **Description** | `kuakuawo` | 应用描述 |
| **Bundle ID** | 选择 **"Explicit"** | 精确 Bundle ID |
| **Bundle ID** | `com.kuakuawo.app` | 必须唯一 |

### 2.5 选择功能

向下滚动，选择应用需要的功能：

- ✅ **Push Notifications**（推送通知）
- ✅ **HealthKit**（可选）
- ✅ **HomeKit**（可选）

点击 **"Continue"**

### 2.6 确认并注册

1. 检查信息是否正确
2. 点击 **"Register"**

---

## 🏪 第 3 步：在 App Store Connect 创建应用

### 3.1 访问 App Store Connect

1. 打开浏览器，访问 https://appstoreconnect.apple.com
2. 用 Apple ID 登录

### 3.2 创建新应用

1. 点击 **"My Apps"**
2. 点击左上角的 **"+"**
3. 选择 **"New App"**

### 3.3 填写应用信息

| 字段 | 填写内容 | 说明 |
|------|--------|------|
| **Platform** | iOS | 选择 iOS |
| **App Name** | 夸夸我 | 应用名称 |
| **Primary Language** | Chinese (Simplified) | 中文简体 |
| **Bundle ID** | com.kuakuawo.app | 选择您刚创建的 Bundle ID |
| **SKU** | kuakuawo-001 | 唯一标识符 |

### 3.4 点击 "Create"

---

## 📝 第 4 步：填写应用详细信息

### 4.1 应用信息

1. 在 App Store Connect 中，点击您的应用
2. 点击 **"App Information"**

填写以下内容：

| 字段 | 填写内容 |
|------|--------|
| **App Name** | 夸夸我 |
| **Subtitle** | 做你的挚友 |
| **Category** | 生活方式 或 健康健身 |
| **Content Rights** | ✅ 勾选 |
| **Age Rating** | 4+ |

### 4.2 描述

1. 点击 **"Description"**
2. 填写应用描述（中文）：

```
夸夸我是一款 AI 夸奖应用。

根据您的输入，我们的 AI 会为您生成温暖、定制化的夸奖。
无论您是在职场遇到挫折、学习感到疲惫，还是在生活中感到孤独，
我们都会像您的挚友一样，用温暖的话语为您加油打气。

功能特性：
- 🎯 定制化夸奖：根据您的具体情况生成专属夸奖
- 💝 收藏高光：保存那些温暖的时刻
- 📊 Echo 回响：查看您的成长记录
- 🌈 多个主题：职场、学习、人际、自我等多个场景

让我们一起，成为彼此的挚友。
```

### 4.3 关键词

1. 点击 **"Keywords"**
2. 填写搜索关键词（用逗号分隔）：

```
夸奖, AI, 心理, 鼓励, 温暖, 挚友, 心理健康, 自我提升
```

### 4.4 支持 URL

1. 点击 **"Support URL"**
2. 填写：`https://kuakuawo.vercel.app`

### 4.5 隐私政策

1. 点击 **"Privacy Policy URL"**
2. 填写：`https://kuakuawo.vercel.app/privacy`

（如果没有隐私政策页面，我们稍后会创建）

---

## 🖼️ 第 5 步：上传应用图标和截图

### 5.1 应用图标

1. 点击 **"App Icon"**
2. 上传 1024x1024 的应用图标（PNG 格式）
3. 使用您的 App Logo（爱心图标）

### 5.2 应用截图

1. 点击 **"Screenshots"**
2. 为 iPhone 6.7" Display 上传 5-10 张截图

**推荐截图内容：**
1. 首页 - 显示昵称和圆环按钮
2. 输入页面 - 显示输入框和生成按钮
3. 夸奖卡片 - 显示生成的定制化夸奖
4. 收藏功能 - 显示"收藏高光"按钮
5. Echo 页面 - 显示收藏的夸奖
6. 主题选择 - 显示多个主题
7. 管理员后台（可选）- 显示统计数据

### 5.3 预览视频（可选）

1. 点击 **"Preview Video"**
2. 上传应用演示视频（可选，但推荐）

---

## 🔨 第 6 步：使用 Expo EAS 构建 iOS App

### 6.1 安装 EAS CLI

在您的电脑上打开终端，运行：

```bash
npm install -g eas-cli
```

### 6.2 登录 Expo

```bash
eas login
```

输入您的 Expo 账户信息（如果没有，需要先创建）

### 6.3 配置 EAS

在项目目录中运行：

```bash
cd /home/ubuntu/kuakuawo
eas build:configure
```

按照提示选择：
- Platform: iOS
- Apple Team ID: 输入您的 Apple Team ID（在 Apple Developer 中可以找到）

### 6.4 构建 iOS App

```bash
eas build --platform ios --auto-submit
```

这会：
1. 构建 iOS 应用包（.ipa）
2. 自动上传到 App Store Connect
3. 提交审核

**等待时间：** 通常需要 **10-30 分钟**

### 6.5 查看构建状态

1. 打开浏览器，访问 https://expo.dev
2. 登录您的 Expo 账户
3. 查看构建进度

---

## ✅ 第 7 步：App Store 审核

### 7.1 等待审核

- Apple 通常需要 **1-3 天** 审核应用
- 您会收到邮件通知审核结果

### 7.2 审核通过

如果审核通过，您会收到邮件：

```
Your app "夸夸我" has been approved and is now available on the App Store.
```

### 7.3 审核被拒

如果审核被拒，您会收到邮件说明原因。常见原因：

| 原因 | 解决方案 |
|------|--------|
| 隐私政策缺失 | 添加隐私政策 URL |
| 功能不完整 | 确保所有功能正常工作 |
| 内容违规 | 修改应用内容 |
| 崩溃问题 | 修复代码中的 bug |

修改后，重新提交审核

---

## 🎉 第 8 步：发布到 App Store

### 8.1 在 App Store Connect 中发布

1. 登录 https://appstoreconnect.apple.com
2. 点击您的应用
3. 点击 **"App Store"** 标签
4. 点击 **"Prepare for Submission"**

### 8.2 选择发布方式

| 方式 | 说明 |
|------|------|
| **Immediate Release** | 立即发布到 App Store |
| **Phased Release** | 分阶段发布（推荐） |
| **Manual Release** | 手动发布 |

选择 **"Phased Release"**（分阶段发布）

### 8.3 点击 "Submit for Review"

1. 确认所有信息正确
2. 点击 **"Submit for Review"**
3. 应用进入审核队列

---

## 📊 第 9 步：监控应用发布

### 9.1 查看发布状态

1. 在 App Store Connect 中，点击 **"App Store"** 标签
2. 查看 **"Version Release"** 部分
3. 您会看到发布进度

### 9.2 发布完成

当状态变为 **"Ready for Sale"** 时，应用已发布到 App Store

### 9.3 用户下载

用户现在可以：
1. 打开 App Store
2. 搜索 "夸夸我"
3. 点击 "Get" 下载
4. 安装应用

---

## 🎯 最终成果

完成以上步骤后：

| 项目 | 链接/位置 | 用途 |
|------|---------|------|
| **iOS App** | Apple App Store | 用户下载安装 |
| **前端 Web** | `https://kuakuawo.vercel.app` | Web 版本 |
| **管理员后台** | `https://kuakuawo.vercel.app/admin` | 查看统计数据 |
| **后端 API** | `https://kuakuawo-api.vercel.app` | 后端服务 |

---

## 🆘 常见问题

### Q1：如何获取 Apple Team ID？

**答案：**
1. 登录 https://developer.apple.com
2. 点击 **"Account"**
3. 点击 **"Membership"**
4. 在 "Team ID" 部分找到您的 ID

### Q2：构建失败，显示 "Build failed"

**解决方案：**
1. 检查代码是否有错误
2. 查看 Expo 的构建日志
3. 确保所有环境变量都正确设置

### Q3：App Store 审核被拒

**常见原因和解决方案：**

| 原因 | 解决方案 |
|------|--------|
| 隐私政策缺失 | 创建隐私政策页面 |
| 功能不完整 | 测试所有功能 |
| 崩溃问题 | 修复代码 bug |
| 内容违规 | 修改应用内容 |

修改后重新提交

### Q4：如何更新应用？

**答案：**
1. 修改代码
2. 增加版本号（在 `app.config.ts` 中）
3. 重新运行 `eas build --platform ios --auto-submit`
4. 提交新版本到 App Store

---

## 📝 关键信息记录表

请保存以下信息：

| 信息 | 内容 |
|------|------|
| Apple ID | |
| Apple Team ID | |
| Bundle ID | `com.kuakuawo.app` |
| App Store Connect 应用链接 | |
| 应用名称 | 夸夸我 |

---

## ⏱️ 时间预估

| 步骤 | 预计时间 |
|------|--------|
| 注册 Apple Developer | 1-2 天 |
| 创建 App ID | 10 分钟 |
| 填写应用信息 | 30 分钟 |
| 上传图标和截图 | 20 分钟 |
| 构建 iOS App | 10-30 分钟 |
| App Store 审核 | 1-3 天 |
| 发布 | 立即 |

**总计：** 2-5 天

---

**现在就可以开始发布到 App Store 了！按照上面的步骤一步步操作。有任何问题随时告诉我！** 🚀

**建议：** 先完成 Vercel 部署，验证应用正常运行后，再开始 App Store 发布流程。
