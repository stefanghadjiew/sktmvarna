import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router'

import { seoPages, type SeoKey } from '@/seo/pages'

declare const __SITE_URL__: string

function setMeta(attribute: 'name' | 'property', key: string, content: string) {
  let tag = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute(attribute, key)
    document.head.append(tag)
  }
  tag.content = content
}

function setLink(rel: string, href: string) {
  let tag = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`)
  if (!tag) {
    tag = document.createElement('link')
    tag.rel = rel
    document.head.append(tag)
  }
  tag.href = href
}

/**
 * Gives the current screen its own `<title>`, description, canonical URL and
 * social preview, in the active language. The build bakes the Bulgarian
 * versions into each page's HTML for crawlers that don't run scripts; this
 * keeps them right after client-side navigation and language switches.
 *
 * `override` is for pages whose title comes from data, such as a tournament.
 */
export function usePageMeta(
  key: SeoKey | 'notFound',
  override?: { title: string; description: string },
) {
  const { t, i18n } = useTranslation()
  const { pathname } = useLocation()

  const title = override?.title ?? t(`seo.${key}.title`)
  const description = override?.description ?? t(`seo.${key}.description`)
  const page = seoPages.find((item) => item.key === key)
  const indexable = key !== 'notFound' && (page?.index ?? true)

  useEffect(() => {
    const url = `${__SITE_URL__}${pathname === '/' ? '/' : pathname.replace(/\/$/, '')}`
    document.title = title
    setMeta('name', 'description', description)
    setMeta('name', 'robots', indexable ? 'index, follow' : 'noindex, follow')
    setMeta('property', 'og:title', title)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:url', url)
    setMeta('property', 'og:locale', i18n.resolvedLanguage === 'en' ? 'en_US' : 'bg_BG')
    setLink('canonical', url)
  }, [title, description, pathname, indexable, i18n.resolvedLanguage])
}
