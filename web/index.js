/* global CodeMirror, ShowdownExtra, Prism */

/**
 * @type {typeof import('codemirror')}
 */
var editor = CodeMirror.fromTextArea(document.getElementById('editor'), {
  mode: {
    name: 'yaml-frontmatter',
    base: 'markdown'
  },
  extraKeys: {
    Tab: (cm) => cm.execCommand('indentMore'),
    'Shift-Tab': (cm) => cm.execCommand('indentLess')
  },
  matchTags: true,
  matchBrackets: true,
  autoCloseBrackets: true,
  lineWrapping: true
})
editor.setSize('100%', '100%')

/**
 * @type {import('..')}
 */
var showdownExtra = new ShowdownExtra({
  frontmatter: true
})

function parse (s) {
  const markdown = typeof s === 'string' ? s : editor.getValue()
  const content = showdownExtra.parse(markdown)
  const elOutput = document.getElementById('output')
  elOutput.innerHTML = content
  elOutput.querySelectorAll('pre code').forEach((el) => {
    Prism.highlightElement(el)
  })
}

editor.on('change', parse)
editor.setValue(require('fs').readFileSync(`${__dirname}/../example.md`, 'utf8'))
