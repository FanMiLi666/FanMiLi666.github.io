# 博客源码

这是博客的 Hexo 源码工程，页面发布产物仍位于仓库根目录，以兼容当前 GitHub Pages 的部署方式。

## 本地预览

```bash
cd blog-source
pnpm install
npm --prefix themes/butterfly ci --omit=optional
pnpm exec hexo clean
pnpm exec hexo server
```

## 新增文章

```bash
pnpm exec hexo new post "文章标题"
```

文章放在 `source/_posts/`。发布前运行 `pnpm exec hexo generate`；生成结果在 `public/`，需要经过检查后再同步到仓库根目录。

当前使用 Butterfly 4.4，以保持与历史文章的页面结构兼容。后续会逐步迁移旧文章的 Markdown 源文件，并升级主题与构建流程。
