(() => {
  const DAY = 24 * 60 * 60 * 1000

  const addSiteNav = () => {
    const menu = document.querySelector('#menus .menus_items')
    if (!menu) return

    const entries = [
      { href: '/guide/', icon: 'fas fa-map-signs fa-fw', label: '指南' },
      { href: '/projects/', icon: 'fas fa-rocket fa-fw', label: '项目' }
    ]

    for (const entry of entries) {
      if (menu.querySelector(`a[href="${entry.href}"]`)) continue
      const item = document.createElement('div')
      item.className = 'menus_item'
      item.dataset.siteNavigation = entry.label
      item.innerHTML = `<a class="site-page" href="${entry.href}"><i class="${entry.icon}"></i><span> ${entry.label}</span></a>`
      menu.append(item)
    }
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

  const addRandomPost = () => {
    if (!document.body.classList.contains('is-home') && !document.querySelector('#site-info')) return
    const siteInfo = document.querySelector('#site-info')
    if (!siteInfo || siteInfo.querySelector('[data-random-post]')) return

    const button = document.createElement('button')
    button.type = 'button'
    button.className = 'random-post-button'
    button.dataset.randomPost = 'true'
    button.innerHTML = '<i class="fas fa-dice"></i> 随机读一篇'
    button.addEventListener('click', async () => {
      button.disabled = true
      button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 正在挑选'
      try {
        const sitemap = await fetch('/sitemap.xml').then(response => response.text())
        const links = [...sitemap.matchAll(/<loc>(https?:\/\/[^<]+)<\/loc>/g)]
          .map(match => new URL(match[1]).pathname)
          .filter(pathname => /^\/20\d{2}\//.test(pathname))
        if (!links.length) throw new Error('empty sitemap')
        window.location.assign(links[Math.floor(Math.random() * links.length)])
      } catch {
        window.location.assign('/archives/')
      }
    })
    siteInfo.append(button)
  }

  const updateReadingProgress = () => {
    const progress = document.querySelector('[data-reading-progress]')
    const article = document.querySelector('#article-container')
    if (!progress || !article) return
    const articleTop = article.getBoundingClientRect().top + window.scrollY
    const readableHeight = Math.max(1, article.offsetHeight - window.innerHeight * 0.38)
    const percentage = Math.min(100, Math.max(0, ((window.scrollY - articleTop + window.innerHeight * 0.38) / readableHeight) * 100))
    progress.style.transform = `scaleX(${percentage / 100})`
  }

  const addReadingProgress = () => {
    const article = document.querySelector('#article-container')
    const current = document.querySelector('[data-reading-progress]')
    if (!article) {
      if (current) current.remove()
      return
    }
    if (!current) {
      const progress = document.createElement('div')
      progress.className = 'reading-progress'
      progress.dataset.readingProgress = 'true'
      progress.setAttribute('aria-hidden', 'true')
      document.body.append(progress)
    }
    updateReadingProgress()
  }

  const run = () => {
    addSiteNav()
    enhancePost()
    addRandomPost()
    addReadingProgress()
  }

  document.addEventListener('error', event => {
    const image = event.target
    if (!(image instanceof HTMLImageElement) || image.dataset.imageFallback) return
    image.dataset.imageFallback = 'true'
    image.classList.add('image-fallback')
    image.alt = image.alt || '图片加载失败'
    image.src = '/img/image-unavailable.svg'
  }, true)

  document.addEventListener('DOMContentLoaded', run)
  document.addEventListener('pjax:complete', run)
  window.addEventListener('scroll', updateReadingProgress, { passive: true })
  window.addEventListener('resize', updateReadingProgress, { passive: true })
})()
