---
title: Awesome front matter
isCool: true
numbers:
  - a-list: 1
---

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

These are supported, unlike [https://github.com/patarapolw/showdown-extra/tree/master/example.md](https://github.com/patarapolw/showdown-extra/tree/master/example.md) (Please view on GitHub to see differences.)

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

.special pre code {
  font-family: serif;
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

Class wrapping is possible due to [https://github.com/showdownjs/showdown/wiki/Showdown's-Markdown-syntax#handling-html-in-markdown-documents](https://github.com/showdownjs/showdown/wiki/Showdown's-Markdown-syntax#handling-html-in-markdown-documents), please try

<markdown indent=2 class="special" style="color: purple;">
  ## This is not indented.

    ## This is indented.
</markdown>

You can also declare inline CSS this way.

By default, Markdown is sanitized, Youtube and Blur has to be done by custom tags.

^^youtube 9xwazD5SyVg

<blur>
![Very NSFW Image](https://placeimg.com/640/480/any =300x*)
  
Text is blurred too.
</blur>

## Standard HTML features

The question still remains, how do I add **spoiler**?

This is a standard HTML feature, use `<details>`,

<details>
  <summary>Aforementioned matter</summary>
  <markdown>
    Something else

    ```yaml
    title: Awesome front matter
    isCool: true
    numbers:
      - a-list: 1
    ```
  </markdown>
</details>
