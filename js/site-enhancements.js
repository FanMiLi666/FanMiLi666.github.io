(() => {
  const DAY = 24 * 60 * 60 * 1000

  const addProjectsNav = () => {
    const menu = document.querySelector('#menus .menus_items')
    if (!menu || menu.querySelector('[data-site-projects]')) return

    const item = document.createElement('div')
    item.className = 'menus_item'
    item.dataset.siteProjects = 'true'
    item.innerHTML = '<a class="site-page" href="/projects/"><i class="fas fa-rocket fa-fw"></i><span> 项目</span></a>'
    menu.append(item)
  }

  const enhancePost = () => {
    const article = document.querySelector('#article-container')
    if (!article || article.querySelector('[data-site-enhanced]')) return
    article.dataset.siteEnhanced = 'true'

    const created = document.querySelector('.post-meta-date-created')
    const publishedAt = created && created.getAttribute('datetime')
    if (publishedAt && (Date.now() - new Date(publishedAt).getTime()) / DAY > 540) {
      const notice = document.createElement('aside')
      notice.className = 'post-freshness-notice'
      notice.innerHTML = '<i class="fas fa-clock"></i><span>这篇文章发布已超过 18 个月。技术内容可能已有变化，建议结合官方文档与当前版本验证。</span>'
      article.prepend(notice)
    }

    const text = article.innerText.replace(/\s+/g, '')
    const minutes = Math.max(1, Math.ceil(text.length / 450))
    const meta = document.querySelector('#post-meta .meta-secondline') || document.querySelector('#post-meta')
    if (meta && !meta.querySelector('[data-read-time]')) {
      const readTime = document.createElement('span')
      readTime.dataset.readTime = 'true'
      readTime.className = 'post-meta-readtime'
      readTime.innerHTML = `<i class="fas fa-book-open fa-fw post-meta-icon"></i><span>${minutes} 分钟阅读</span>`
      meta.append(readTime)
    }

    const share = document.querySelector('.post_share')
    if (share && navigator.clipboard && !share.querySelector('[data-copy-link]')) {
      const copy = document.createElement('button')
      copy.type = 'button'
      copy.className = 'copy-link-button'
      copy.dataset.copyLink = 'true'
      copy.innerHTML = '<i class="fas fa-link"></i> 复制链接'
      copy.addEventListener('click', async () => {
        await navigator.clipboard.writeText(window.location.href)
        copy.innerHTML = '<i class="fas fa-check"></i> 已复制'
        window.setTimeout(() => { copy.innerHTML = '<i class="fas fa-link"></i> 复制链接' }, 1800)
      })
      share.append(copy)
    }
  }

  const run = () => {
    addProjectsNav()
    enhancePost()
  }

  document.addEventListener('DOMContentLoaded', run)
  document.addEventListener('pjax:complete', run)
})()
