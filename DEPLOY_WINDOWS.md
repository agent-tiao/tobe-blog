# Windows 环境下 Cloudflare 部署指南 (精简版)

由于本项目自带的 `.sh` 脚本和 `OpenNext` 工具在 Windows 原生环境下（CMD/PowerShell）兼容性较差，推荐在 Windows 上使用以下**原生命令 + GitHub 自动构建**的流程进行部署，以避开环境报错。

---

## 步骤 1：登录 Cloudflare
在终端运行：
```bash
npx wrangler login
```

## 步骤 2：准备配置文件
1. 手动复制 `wrangler.toml` 并命名为 `wrangler.local.toml`。
2. 打开 `wrangler.local.toml`，将 `NEXT_PUBLIC_SITE_URL` 修改为你的实际域名。

## 步骤 3：创建云端资源 (跳过 cf:init 脚本)
在终端直接运行以下原生命令来创建数据库和存储桶：

```bash
# 1. 创建 D1 数据库
npx wrangler d1 create tobe-blog-db --binding DB --use-remote --update-config -c wrangler.local.toml

# 2. 创建 R2 存储桶（注意：必须先在 Cloudflare 网页端开通 R2 权限，通常需要绑卡）
npx wrangler r2 bucket create tobe-blog-images --binding IMAGES --update-config -c wrangler.local.toml
```

## 步骤 4：初始化数据库与类型
```bash
# 1. 执行 SQL 写入表结构
npx wrangler d1 execute tobe-blog-db --remote --file=db/schema.sql -c wrangler.local.toml

# 2. 生成 TypeScript 类型（替代 npm run cf-typegen）
npx wrangler types --env-interface CloudflareEnv -c wrangler.local.toml
```

## 步骤 5：设置后台管理员密码
```bash
npx wrangler secret put ADMIN_PASSWORD -c wrangler.local.toml
```
*按提示输入你想设置的密码即可。*

## 步骤 6：通过 GitHub 托管并自动部署 (彻底避开本地构建失败)
由于 `OpenNext` 在 Windows 下构建极易崩溃，**强烈建议使用 Cloudflare 线上自动构建**：

1. 在 GitHub 上创建一个新的仓库（比如 `tobe-blog`）。
2. 将本地代码关联并推送到该仓库：
   ```bash
   git remote add origin git@github.com:你的用户名/你的仓库名.git
   git add .
   git commit -m "chore: initial commit for windows deploy"
   git push -u origin main
   ```
3. 登录 Cloudflare 网页后台，进入 **Workers & Pages** -> **Create application** -> **Pages** -> **Connect to Git**。
4. 选中你的 GitHub 仓库，在构建设置中填写：
   * **框架预设 (Framework preset)**：选择 **None**。
   * **构建命令 (Build command)**：输入 `npx opennextjs-cloudflare build`
   * **输出目录 (Output directory)**：输入 `.open-next/assets`
5. 点击保存并部署。以后你本地只需要 `git push`，Cloudflare 就会自动在云端帮你完成构建和更新。
