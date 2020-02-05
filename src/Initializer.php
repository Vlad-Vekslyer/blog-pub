<?php

  // the initialize function takes an array of functions and calls each function
  function initialize($initializers = array('initAutoloaderClasses', 'initAutoloaderComposer', 'initTwig','initEnv')){
    $sl = getenv('PHP_ENV') && getenv('PHP_ENV') == 'PROD' ? '/' : '\\';
    foreach ($initializers as $initializer)
      $initializer($sl);
  }

  // load .env file to set envriomental variables
  function initEnv($sl){
    $env = __DIR__ . "$sl..$sl.env";
    if(file_exists($env)){
      $dotenv = new \Symfony\Component\Dotenv\Dotenv();
      $dotenv->load($env);
    }
  }

  // set autoloader for composer
  function initAutoloaderComposer($sl){
    $autoload = __DIR__ . "$sl.." . $sl . "vendor" . $sl . "autoload.php";
    require_once $autoload;
  }

  // initialize a twig Environment object to be rendered throughout the application
  function initTwig($sl){
    initAutoloaderComposer($sl);
    $views = __DIR__ . "$sl.." . $sl . "views";
    $loader = new \Twig\Loader\FilesystemLoader($views);
    $twig = new \Twig\Environment($loader);
    $GLOBALS['twig'] = $twig;
  }

  // initialize autoloading of classes inside of fully-qualified namespaces
  function initAutoloaderClasses(){
    spl_autoload_register(function($class){
      $sl = getenv('PHP_ENV') && getenv('PHP_ENV') == 'PROD' ? '/' : '\\';
      $prefix = "Blog\\";
      $len = strlen($prefix);
      if (strncmp($prefix, $class, $len) !== 0)
        return;

      $file = __DIR__ . $sl . str_replace('\\', '/', $class) . '.php';
      if (file_exists($file))
        require $file;
    });
  }
 ?>
