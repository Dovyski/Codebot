Codebot
=======

Codebot is a free and open source (MIT license) IDE focused on game development. Below is a screenshot of the current development state (something like pre-alpha):
![codebot_dev_pre_alpha_002](https://f.cloud.github.com/assets/512405/2018937/ed068ae2-8818-11e3-998c-7633a0933945.png)

Idea and Goals
=======

Codebot is a code editing program equipped with built-in tools to help you make your game faster (read full thoughts [here](http://www.as3gamegears.com/blog/codebot-an-ide-focused-on-gamedev/)). Developing a game is much more than just coding, you have to tweak art, build levels, convert files, find assets/extensions, read docs about building and publishing, and so on.

The IDE should help us do that, or do it all by itself. Imagine you are working on your [Ludum Dare](http://www.ludumdare.com/)/[1GAM](http://onegameamonth.com) game and you need an 8-bit SFX. You click a button, a panel slides, you type in a few keywords, select what you want and done!

Some features Codebot will probably have:

* Create icons in all sizes required by Google, Apple, OUYA, etc using a single PNG image;
* Build to different platforms using as few configuration as possible (e.g. build APK for Android and EXE for Windows, wrapping/compiling them the best way possible);
* Smart files: open a CSV file that describes a level (tilemap), the IDE offers the possibility to render that file if you provide a spritesheet;
* Easily find and download music/SFX using a sliding panel;
* Package sprites into an atlas;
* Extract sprites/tiles from image;
* Easy development steps. E.g. built-in web server for HTML5 gamedev;
* Easily find and add extensions/libs to a project (slide a panel, search, click integrate, done!).


Supported plataforms
=======

* MacOS (***working***)
* Linux (*under development*)
* Windows (*under development*)
* ChromeOS (*under development*)
* Web (running as a website) (*under development*)

Under the hood Codebot is built with JS/HTML/CSS on top of [Node Webkit](https://github.com/rogerwang/node-webkit).

Contribute
=======

The development process is a little bit rough right now. It's basically me coding and changing things a lot, without documenting anything along the way. At some point, the APIs will stabilize and it will be a lot easier to join the party.

If you want to help now, you can take Codebot for a ride and send me your feedback, or suggest a feature, or send a "cool!"/"insane!" motivational message :). Just ping me at [@as3gamegears](http://twitter.com/as3gamegears).

Follow development
=======

I'm blogging about Codebot at [As3GameGears](http://www.as3gamegears.com/tag/codebot/).

