<?php
    define('BASE_URL', '.');
    require_once(dirname(__FILE__).'/head.php');
?>

<!-- NAVBAR
================================================== -->
  <body>
    <div class="navbar-wrapper">
      <div class="container">
        <nav class="navbar navbar-static-top">
          <div class="container">
            <div class="navbar-header">
			  <img src="./img/codebot-logo-64.png" />
              <a class="navbar-brand" href="./">Codebot</a>
            </div>
            <div id="navbar" class="navbar-collapse collapse">
              <ul class="nav navbar-nav pull-right">
                  <li><a href="./about">About</a></li>
                  <li><a href="#features">Features</a></li>
                  <li><a href="./pricing">Pricing</a></li>
                  <li><a href="http://blog.codebot.cc" target="_blank">Blog</a></li>
                  <li><a href="https://github.com/Dovyski/Codebot" target="_blank"><img src="./img/github.png" style="width: 35px; height: auto; margin-top: -10px;" title="Github repo"> Fork on Github</a></li>
              </ul>
            </div>
          </div>
        </nav>
      </div>
    </div>

    <!-- Carousel
    ================================================== -->
    <div class="carousel">
        <div class="carousel-caption">
          <p>A gamedev IDE on the cloud.</p>
          <p><a class="btn btn-lg btn-primary" href="https://web.codebot.cc" role="button">Try now, it's free!</a></p>
        </div>
		<div class="image"><img src="./img/codebot-app-small.png" title="A gamedev IDE on the cloud."/></div>
        <div class="clouds"></div>
    </div><!-- /.carousel -->

    <!-- Marketing messaging and featurettes
    ================================================== -->
    <!-- Wrap the rest of the page in another container to center all the content. -->

    <div class="container marketing">
      <!-- Three columns of text below the carousel -->
      <div class="row marketing-top">
        <a name="features"></a>
        <div class="col-lg-4">
          <img src="./img/cloud-upload.png" alt="Cloud-based">
          <h2>Cloud-based</h2>
          <p>All your data is automatically stored in the cloud. Access your projects and files anywhere, anytime.</p>
        </div><!-- /.col-lg-4 -->
        <div class="col-lg-4">
          <img src="./img/code.png" alt="Toolchain">
          <h2>Code</h2>
          <p>An in-browser code editor integrated with a remote toolchain. Your SDK always up-to-date and ready to be used, no installs.</p>
        </div><!-- /.col-lg-4 -->
        <div class="col-lg-4">
          <img src="./img/gamepad.png" alt="Gamedev built-in">
          <h2>Gamedev built-in</h2>
          <p>Lots of tools to help you: tiles extractor, atlas creator, sfx generator, assets finder, icon resizer, csv visualizer, and more.</p>
        </div><!-- /.col-lg-4 -->
       </div><!-- /.row -->
   </div><!-- /.container -->

   <div class="container-fluid marketing">
      <!-- START THE FEATURETTES -->

      <div class="row featurette featurette-odd">
        <div class="col-md-1"></div>
        <div class="col-md-5">
          <h2 class="featurette-heading">Full-featured code editor. <span class="text-muted">With all you would expect.</span></h2>
          <p class="lead">Feel at home with a complete code editor, with syntax highlighting, multiple tabs to organize open files, shortcuts, different visual themes and more.</p>
          <p class="lead">Built on top of popular <a href="http://ace.c9.io/" target="_blank">Ace</a> editor, it has a native look and feel to make you confortable while programming.</p>
        </div>
        <div class="col-md-1"></div>
        <div class="col-md-4">
            <img class="featurette-image-right" src="./img/browser-chrome.png">
            <img class="featurette-image-right" src="./img/feature-code-editor.gif" alt="Full-featured code editor.">
        </div>
        <div class="col-md-1"></div>
      </div>

      <div class="row featurette">
        <div class="col-md-1"></div>
        <div class="col-md-4">
            <img class="featurette-image-left" src="./img/browser-chrome.png" width="602">
			<img class="featurette-image-left" src="./img/feature-work-bar.gif" alt="No complex menus.">
        </div>
        <div class="col-md-1"></div>
        <div class="col-md-5">
            <h2 class="featurette-heading">No complex menus. <span class="text-muted">Just a bar and sliding panels.</span></h2>
            <p class="lead">Less is more, so no cluttering. Every button exists for a reason and they are all located in the same place: the working bar. Forget about all those menus and submenus that bury your actions. Enjoy a clean and delightful experience.</p>
        </div>
        <div class="col-md-1"></div>
      </div>

	  <div class="row featurette featurette-odd">
        <div class="col-md-1"></div>
        <div class="col-md-5">
            <h2 class="featurette-heading">Code, compile and test your project. <span class="text-muted">All in the browser.</span></h2>
            <p class="lead">Choose among several different technologies to create your game. Your project is compiled in the server and the result is sent back to you. Don't waste more time installing SDKs, they are always updated and ready to use.<br /><br />Available technologies: <br /><img src="./img/platforms.png" title="Available platforms for development." style="margin-top: 10px;"></p>
        </div>
        <div class="col-md-1"></div>
        <div class="col-md-4">
            <img class="featurette-image-right" src="./img/browser-chrome.png">
            <img class="featurette-image-right" src="./img/feature-compile.gif" alt="Code, compile and test your project.">
        </div>
        <div class="col-md-1"></div>
      </div>

      <div class="row featurette">
        <div class="col-md-1"></div>
        <div class="col-md-4">
            <img class="featurette-image-left" src="./img/browser-chrome.png">
			<img class="featurette-image-left" src="./img/feature-files-panel.gif" alt="Easily manage files">
        </div>
        <div class="col-md-1"></div>
        <div class="col-md-5">
            <h2 class="featurette-heading">Easily manage files. <span class="text-muted">All in a single panel.</span></h2>
            <p class="lead">The files panel presets an overview of the files in your project. Create a new project from a Git repository, or just add files by drag-and-dropping them into the browser. Using the files panel, you can create files and folders, as well as rename, delete and move them around.</p>
        </div>
        <div class="col-md-1"></div>
      </div>

      <div class="row featurette featurette-odd">
        <div class="col-md-1"></div>
        <div class="col-md-5">
            <h2 class="featurette-heading">Create 8-bit SFXs. <span class="text-muted">Add with a click.</span></h2>
            <p class="lead">Have you ever needed a (placeholder) SFX for your game but you didn't want the trouble of looking for it? That is not a problem anymore! Automatically create 8-bit SFX with a single click without ever leaving your editor. Choose from pre-defined generators or tweak any generated SFX to your needs.</p>
        </div>
        <div class="col-md-1"></div>
        <div class="col-md-4">
            <img class="featurette-image-right" src="./img/browser-chrome.png" width="602">
            <img class="featurette-image-right" src="./img/feature-sfxr.gif" alt="Create 8-bit SFXs. Add with a click.">
        </div>
        <div class="col-md-1"></div>
      </div>

      <div class="row featurette">
        <div class="col-md-1"></div>
        <div class="col-md-4">
            <img class="featurette-image-left" src="./img/browser-chrome.png" width="602">
			<img class="featurette-image-left" src="./img/feature-assets-finder.gif" alt="Quickly find assets. Without leaving your editor.">
        </div>
        <div class="col-md-1"></div>
        <div class="col-md-5">
            <h2 class="featurette-heading">Quickly find assets. <span class="text-muted">Without leaving your editor.</span></h2>
            <p class="lead">If you want graphics for your game, be it a placeholder or the real deal, you don't have to stop the development of your game to find them. Search assets by keywords from a curated list and add them to your project in seconds.</p>
        </div>
        <div class="col-md-1"></div>
      </div>

      <div class="row featurette featurette-odd">
        <div class="col-md-1"></div>
        <div class="col-md-5">
            <h2 class="featurette-heading">View and edit any file. <span class="text-muted">Text, image, audio, you name it!</span></h2>
            <p class="lead">Developing a game involves several different disciplines like music, art and code. Quite often you need a wide range of different programs just to make tweaks in some files, e.g. trim a SFX, crop an image, etc. Now you have basic tools to do that, all integrated in a single place. Just open a file and edit it.</p>
        </div>
        <div class="col-md-1"></div>
        <div class="col-md-4">
            <img class="featurette-image-right" src="./img/browser-chrome.png" width="602">
            <img class="featurette-image-right" src="./img/feature-files.gif" alt="View and edit any file. Text, images, audios, you name it!">
        </div>
        <div class="col-md-1"></div>
      </div>

      <div class="row featurette">
        <div class="col-md-1"></div>
        <div class="col-md-4">
            <img class="featurette-image-left" src="./img/browser-chrome.png" width="602">
			<img class="featurette-image-left" src="./img/feature-manage-projects.gif" alt="Manage all your projects. No matter their platform">
        </div>
        <div class="col-md-1"></div>
        <div class="col-md-5">
            <h2 class="featurette-heading">Manage all your projects. <span class="text-muted">No matter their platform.</span></h2>
            <p class="lead">Create and manage several different projects in a single place. You can work on more than one game at the time if you want while keeping everything structured and organized in separted projects.</p>
        </div>
        <div class="col-md-1"></div>
      </div>

      <div class="row featurette featurette-odd">
        <div class="col-md-1"></div>
        <div class="col-md-5">
            <h2 class="featurette-heading">Create projects easily. <span class="text-muted">Platforms and templates to choose from.</span></h2>
            <p class="lead">You want to focus on your game ideas, not on boilerplate files. When creating a new project, select from a list of existing templates to bootstrap your project quickly. Forget about copying those same files around and writing that same piece of code over and over.</p>
        </div>
        <div class="col-md-1"></div>
        <div class="col-md-4">
            <img class="featurette-image-right" src="./img/browser-chrome.png" width="602">
            <img class="featurette-image-right" src="./img/feature-project-create.gif" alt="Create projects easily">
        </div>
        <div class="col-md-1"></div>
      </div>

      <div class="row featurette">
        <div class="col-md-1"></div>
        <div class="col-md-4">
            <img class="featurette-image-left" src="./img/browser-chrome.png" width="602">
			<img class="featurette-image-left" src="./img/feature-plugins.gif" alt="Plugins! Change or add anything you want.">
        </div>
        <div class="col-md-1"></div>
        <div class="col-md-5">
            <h2 class="featurette-heading">Plugins! <span class="text-muted">Change or add anything you want.</span></h2>
            <p class="lead">If you have special needs to develop your game, you are not trapped. Browse a list of existing plugins, enable them and enhance your experience.</p>
            <p class="lead">Plugins can do pretty much everything, from enabling you to edit a new file extension to helping you translate game text. If you haven't found the feature you were looking for, create a plugin yourself!</p>
        </div>
        <div class="col-md-1"></div>
      </div>

      <!-- /END THE FEATURETTES -->
    </div><!-- /.container -->

	<div class="action-call">
        <img src="./img/gamedev-big.png">
		<p><strong>Stop wasting time managing tools!</strong></p>
        <p>Spend time making games instead!</p>
        <p><a class="btn btn-lg btn-primary" href="https://web.codebot.cc" role="button">Try now, it's free!</a></p>
        <div class="clouds"></div>
	</div><!-- /.carousel -->

<?php
    require_once(dirname(__FILE__).'/footer.php');
?>
