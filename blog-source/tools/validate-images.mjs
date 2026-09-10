import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve('public')
const htmlFiles = []

const walk = directory => {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name)
    if (entry.isDirectory()) walk(target)
    else if (entry.name.endsWith('.html')) htmlFiles.push(target)
  }
}

walk(root)

const problems = []
for (const file of htmlFiles) {
  const html = fs.readFileSync(file, 'utf8')
  for (const match of html.matchAll(/<img\b[^>]*\bsrc="([^"]+)"/g)) {
    const src = match[1]
    if (/^\/(Users|\.\.%5C)|%5C/i.test(src)) problems.push(`${file}: 非法本地图片路径 ${src}`)
    if (src.startsWith('/img/') && !fs.existsSync(path.join(root, src))) problems.push(`${file}: 缺少本地图片 ${src}`)
    if (src.includes('fswblog.oss-cn-nanjing.aliyuncs.com')) problems.push(`${file}: 仍在使用已失效的 OSS 图片 ${src}`)
  }
}

if (problems.length) {
  console.error(problems.join('\n'))
  process.exit(1)
}

console.log(`图片校验通过：${htmlFiles.length} 个页面未发现失效的本地图片引用。`)
