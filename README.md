---
title: Awesome front matter
isCool: true
numbers:
  - a-list: 1
---

# showdown-extra

My custom Showdown.js settings, with CSS and Pug support.

## Extended syntaxes

These are options of Showdown.js, which I have enabled.

- [emoji](https://github.com/showdownjs/showdown/wiki/Emojis)

:smile: :100:

- Table

| h1    |    h2   |      h3 |
|:------|:-------:|--------:|
| 100   | [a][1]  | ![b][2] |
| *foo* | **bar** | ~~baz~~ |

## Custom syntaxes

These are supported, unlike <https://github.com/patarapolw/showdown-extra/tree/master/README.md> (Please view on GitHub to see differences.)

CSS is supported, but is scoped to prevent leakage.

```html
<style>
h1 {
  color: red;
}
</style>
```

<style>
h1 {
  color: red;
}
</style>

JavaScript, however, is not enabled.

```html
<script>
alert('hello')
</script>
```

<script>
alert('hello')
</script>

#{span(style="color: green;") Pug-like syntax:} [HyperPug](https://github.com/patarapolw/hyperpug) is also supported.

^^youtube 9xwazD5SyVg

The `^^` syntax is powered by <https://github.com/patarapolw/indent-utils>.

## Installation

```bash
yarn add https://github.com/patarapolw/showdown-extra.git
# or
# npm add https://github.com/patarapolw/showdown-extra.git
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
