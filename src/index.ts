import showdown from 'showdown'
import scopeCss from 'scope-css'
import shortid from 'shortid'
import h from 'hyperscript'
import { stripIndent } from 'indent-utils'
import createDOMPurify from 'dompurify'
import escapeRegExp from 'escape-string-regexp'
import eqdict from '@patarapolw/eqdict'

const ext: Record<string, showdown.ShowdownExtension> = {}

export default class ShowdownExtra {
  static ext = ext

  id: string
  frontmatterName: string
  converter: showdown.Converter
  ext: Record<string, showdown.ShowdownExtension>

  lastHtml: string
  lastMetadata: {
    value: string
    type: string
  }

  /**
   * Options:
   * - [options.id] Unique ID, to be able to contain CSS (default: autogenerated)
   * - [options.flavor] Markdown flavor (default: "github")
   * - [options.frontmatter] Whether to parse YAML frontmatter (default: false)
   */
  constructor (options: {
    id?: string
    flavor?: showdown.Flavor
    frontmatter?: boolean | string
  } = {}) {
    const {
      id = `showdown-extra__${shortid.generate()}`,
      flavor = 'github',
      frontmatter
    } = options

    this.id = id
    this.frontmatterName = typeof frontmatter === 'string' ? frontmatter : 'Front Matter'

    this.converter = new showdown.Converter({
      parseImgDimensions: true,
      simplifiedAutoLink: true,
      strikethrough: true,
      tables: true,
      disableForced4SpacesIndentedSublists: true,
      backslashEscapesHTMLTags: true,
      emoji: true,
      metadata: !!frontmatter
    })

    if (flavor) {
      this.converter.setFlavor(flavor)
    }

    this.converter.setOption('simpleLineBreaks', false)

    this.ext = {
      youtube: {
        type: 'lang',
        filter: (s) => {
          return s.replace(/\{% youtube(?:\(([)]+)\))? (.+) %\}/g, (all, attrs: string, url: string) => {
            let width: number | null = null
            let height: number | null = null

            if (attrs) {
              const d = attrs.split(',').map((el) => parseInt(el))
              if (d.every((el) => el) && d.length === 2) {
                width = d[0]
                height = d[1]
              }

              if (!width || !height) {
                const dict = eqdict(attrs)
                width = parseInt(dict.width)
                height = parseInt(dict.height)
              }
            }

            try {
              url = (() => {
                const u = new URL(url)
                const v = u.searchParams.get('v')

                if (v) {
                  return v
                }

                return u.pathname.replace(/$.*\//, '')
              })()
            } catch (e) {}

            return h('div', {
              attrs: {
                [`data-${this.id}`]: MarkdownEscape.escape(`<iframe width="${width || 560}" height="${height || 315}"
                src="https://www.youtube.com/embed/${url}"
                frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen></iframe>`)
              }
            }).outerHTML
          })
        }
      }
    }

    Object.entries(ext).map(([k, v]) => this.converter.addExtension(v, k))
    Object.entries(this.ext).map(([k, v]) => this.converter.addExtension(v, `this.${k}`))

    this.lastHtml = ''
    this.lastMetadata = {
      value: '',
      type: 'yaml'
    }
  }

  parse (s: string): string {
    this.lastHtml = this._parseMarkdownOnly(s)

    const m = this.converter.getMetadata(true)
    this.lastMetadata = {
      value: typeof m === 'string' ? m : JSON.stringify(m),
      type: this.converter.getMetadataFormat()
    }

    s = this._finalizeHtml(this.lastHtml, this.lastMetadata)

    const DOMPurify = createDOMPurify(window)

    const div = DOMPurify.sanitize(s, {
      RETURN_DOM: true
    })

    Array.from(div.getElementsByTagName('style')).forEach((el0) => {
      const html = el0.innerHTML.trim()

      if (html) {
        el0.innerHTML = scopeCss(html, `#${this.id}`)
      }
    })

    div.querySelectorAll(`[data-${this.id}]`).forEach((el) => {
      el.innerHTML = MarkdownEscape.unescape(el.getAttribute(`data-${this.id}`) || '')
      el.removeAttribute(`data-${this.id}`)
    })

    return div.innerHTML
  }

  _parseMarkdownOnly (s: string) {
    const root = document.createElement('body')
    root.innerHTML = this._minparseMarkdown(s)

    Array.from(root.getElementsByTagName('markdown')).forEach((el) => {
      el.replaceWith(h('div', {
        attrs: {
          ...Array.from(el.attributes).reduce((prev, a) => ({ ...prev, [a.name]: a.value }), {}),
          markdown: '1'
        },
        innerHTML: el.innerHTML
      }))
    })

    const filter = 'blur(10px)'

    Array.from(root.getElementsByTagName('blur')).forEach((el) => {
      el.replaceWith(h('div', {
        attrs: {
          [`data-${this.id}`]: MarkdownEscape.escape(h('div', {
            style: {
              filter
            },
            attrs: {
              onclick: `this.style.filter = this.style.filter ? "" : "${filter}"`
            },
            innerHTML: this._parseMarkdownOnly(el.innerHTML)
          }).outerHTML)
        }
      }))
    })

    root.querySelectorAll('[markdown], [data-markdown]').forEach((el) => {
      const indent = el.getAttribute('indent')
      if (indent === null) {
        const innerHTML = el.innerHTML.replace(/^\n/, '').replace(/\n$/, '')
        el.innerHTML = stripIndent(innerHTML)
      }
    })

    root.querySelectorAll('[indent]').forEach((el) => {
      const indent = el.getAttribute('indent')
      const indentRegex = indent ? new RegExp(`^ {1,${parseInt(indent)}}`) : null
      const innerHTML = el.innerHTML.replace(/^\n/, '').replace(/\n$/, '')
      el.innerHTML = indentRegex === null
        ? stripIndent(innerHTML)
        : innerHTML.split('\n').map((line) => line.replace(indentRegex, '')).join('\n')
      el.removeAttribute('indent')
    })

    s = root.innerHTML

    return this.converter.makeHtml(s)
  }

  _finalizeHtml (s: string, metadata: {
    value: string
    type: string
  }): string {
    return h('div', { id: this.id }, [
      ...(metadata.value ? [
        h('details', { attrs: { open: '' } }, [
          h('summary', this.frontmatterName),
          h('pre', [
            h(`code.language-${metadata.type || 'yaml'}`, metadata.value)
          ])
        ])
      ] : []),
      h('main', { innerHTML: s })
    ]).outerHTML
  }

  _minparseMarkdown (s: string) {
    return s
      .replace(/(?:^|\n)```[a-z]+?\n.*?```(?:\n|$)/gsi, (s0) => this.converter.makeHtml(s0))
      .split('\n').map((s0) => {
        if (/`{1}[^`]+`{1}/.test(s0)) {
          return this.converter.makeHtml(s0)
        }
        return s0
      }).join('\n')
      .replace(/^.*<[^>]+>.*$/g, (s) => {
        const m = s.match(/<[^>]+>/g)
        if (m && m.some((el) => el.includes('://'))) {
          return this.converter.makeHtml(s)
        }
        return s
      })
  }
}

const MarkdownEscape = {
  controlChars: [
    '\\',
    '`',
    '*',
    '{',
    '}',
    '[',
    ']',
    '(',
    ')',
    '#',
    '+',
    '-',
    '.',
    '!',
    '_',
    '>',
    '~', '|',
    '\n',
    '"',
    '$',
    '%',
    '&',
    "'",
    ',',
    '/',
    ':',
    ';',
    '<',
    '=',
    '?',
    '@',
    '^'
  ],
  escape (s: string) {
    return s.replace(new RegExp(`(${
      this.controlChars.map((c) => escapeRegExp(c)).join('|')
    })`, 'g'), '\\$1')
  },
  unescape (s: string) {
    return s.replace(new RegExp(`(${
      this.controlChars.map((c) => `\\\\${escapeRegExp(c)}`).join('|')
    })`, 'g'), (_, p1) => p1.substr(1))
  }
}
