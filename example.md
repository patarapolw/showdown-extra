---
title: Awesome front matter
isCool: true
numbers:
  - a-list: 1
---

# showdown-extra

My custom [Showdown.js](https://github.com/showdownjs/showdown) settings, with CSS and HyperPug support.

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

These are supported, unlike <https://github.com/patarapolw/showdown-extra/tree/master/example.md> (Please view on GitHub to see differences.)

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

.serif {
  font-family: serif;
  text-transform: uppercase;
}

.serif h2 {
  color: green;
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

#{span(style="color: green;") Pug-like syntax:} [HyperPug](https://github.com/patarapolw/hyperpug) is also supported, with `#{}`.

For class wrapping, please try

^^hyperpug.
  .serif
    :markdown
      ## Might Be Yes

There is also `^^` syntax is powered by <https://github.com/patarapolw/indent-utils>.

^^youtube 9xwazD5SyVg

^^blur.
  ![Very NSFW Image](https://placeimg.com/640/480/any =300x*)

  Text is blurred too.

For multiline spoiler, it is best told by this.

^^spoiler(summary="Aforementioned matter").

  Something else

  ```yaml
  title: Awesome front matter
  isCool: true
  numbers:
    - a-list: 1
  ```
