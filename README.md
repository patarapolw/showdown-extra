# showdown-extra

My custom [Showdown.js](https://github.com/showdownjs/showdown) settings, with CSS support.

For example, please see [/example.md](/example.md)

## Installation

```bash
yarn add https://github.com/patarapolw/showdown-extra.git
# or
# npm i https://github.com/patarapolw/showdown-extra.git
```

Or if you don't use Node.js or NPM

```html
<script src="https://patarpolw.github.io/showdown-extra/showdown-extra.js"></script>
```

Now, `ShowdownExtra` will be available as a global variable.

After that,

```js
var showdownExtra = new ShowdownExtra({
  frontmatter: true
})
document.getElementById('output').innerHTML = showdownExtra.parse('# Awesome string')
```

For more settings and default options, see <https://github.com/patarapolw/showdown-extra/tree/master/index.js>

## Contributions

Please either open an [issue](https://github.com/patarapolw/showdown-extra/issues), or fork the project and make pull requests.

Suggestions welcome.
