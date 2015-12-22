# [![Movable Titlebar Buttons, Firefox Addon][Logo] Movable Titlebar Buttons][Movable Titlebar Buttons, Firefox Addon]

[![License]][url: License] [![Semver]][url: Semver] [![Gittip]][url: Gittip] [![Download]][url: Download]

> Movable Titlebar Buttons, Firefox Addon, allows you to move the titlebar buttons on Windows 10 (only).

## Screenshots

Here are some screenshots from the addon:

### Together with [Line, Firefox Addon][Line, Firefox Addon]

![Together with Line, Firefox Addon](https://cdn.pbrd.co/images/efItPt1.png)

This is highly recommended as it creates a super minimalistic experience.

### Standalone

![Basic functionality](https://cdn.pbrd.co/images/efRxEqJ.png)

# Features

+ Allows you to move the minimize, maximize/restore, close buttons in Firefox on Windows 10. These buttons can be placed anywhere you can customize it to.

## Installation & Building

### Requirements

+ `Firefox 38+`

### [From AMO (Mozilla Addons)](https://addons.mozilla.org/en-US/firefox/addon/movable-titlebar-buttons/)

Note: Not yet signed, pre-release!

### From Github [![Download]][url: Download]

### Manually, from repository

First clone the repository to your local machine:

```shell
git clone https://github.com/Centril/firefox-movable-titlebar && cd firefox-movable-titlebar
```

Since this is written with the **[Addon SDK]**, you will need to use **[`jpm`]**.

If you haven't installed it before, simply do (you might need to run this with `sudo`):

```shell
npm install jpm -g
```

To test out the addon, try:

```shell
jpm run
```

If you want to package it as an `.xpi`, do:

```shell
jpm xpi
```

## Changelog

See **[CHANGES.md]**.

## Copyright & License

Licensed under the **[GPL 2 License]**.
Copyright 2015 Mazdak Farrokhzad for the modified parts.

## Bugs | Issues | Feature requests | Contribution

Want to contribute? Great stuff! Please use the issue system that github provides to report bugs/issues or request an enhancement. Pull requests are also more than welcome.

## Author

**Mazdak Farrokhzad / Centril [&lt;twingoow@gmail.com&gt;]**

[![twitter][twitter_image]][twitter] [![github][github_image]][github] [![facebook][facebook_image]][facebook]

<!-- references -->

[Gittip]: http://img.shields.io/gittip/Centril.svg?style=flat
[url: Gittip]: https://www.gittip.com/Centril/
[License]: http://img.shields.io/badge/license-GPL_2+-blue.svg?style=flat
[url: License]: LICENSE.md
[Semver]: http://img.shields.io/badge/semver-2.0.0-blue.svg?style=flat
[url: Semver]: http://semver.org/spec/v2.0.0.html
[Download]: https://img.shields.io/badge/Download_XPI-1.0.0--pre-ff69b4.svg?style=flat
[url: Download]: https://github.com/Centril/firefox-movable-titlebar/releases/tag/1.0.1-pre

[Logo]: https://raw.githubusercontent.com/Centril/firefox-movable-titlebar/master/icon.png
[Movable Titlebar Buttons, Firefox Addon]: https://github.com/Centril/firefox-movable-titlebar
[Line, Firefox Addon]: https://github.com/Centril/firefox-line

[Addon SDK]: https://developer.mozilla.org/en-US/Add-ons/SDK
[`jpm`]: https://developer.mozilla.org/en-US/Add-ons/SDK/Tools/jpm#Installation

[twitter]: http://twitter.com/CenoRIX
[twitter_image]: http://cdn.flaticon.com/png/128/8800.png
[github]: https://github.com/centril
[github_image]: http://cdn.flaticon.com/png/128/25231.png
[facebook]: https://www.facebook.com/Centril
[facebook_image]: http://cdn.flaticon.com/png/128/33702.png
[&lt;twingoow@gmail.com&gt;]: mailto:twingoow@gmail.com

[CHANGES.md]: CHANGES.md
[GPL 2 License]: LICENSE.md

<!-- references -->