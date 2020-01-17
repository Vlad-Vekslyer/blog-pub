<?php

  // the initialize function takes an array of functions and calls each function
  function initialize($initializers = array('initAutoloaderClasses', 'initAutoloaderComposer', 'initTwig','initEnv')){
    foreach ($initializers as $initializer)
      $initializer();
  }

  // load .env file to set envriomental variables
  function initEnv(){
    $env = __DIR__ . "\\..\\.env";
    if(file_exists($env)){
      $dotenv = new \Symfony\Component\Dotenv\Dotenv();
      $dotenv->load($env);
    }
  }

  // set autoloader for composer
  function initAutoloaderComposer(){
    $autoload = __DIR__ . "\\..\\vendor\\autoload.php";
    require_once $autoload;
  }

  // initialize a twig Environment object to be rendered throughout the application
  function initTwig(){
    initAutoloaderComposer();
    $views = __DIR__ . "\\..\\views";
    $loader = new \Twig\Loader\FilesystemLoader($views);
    $twig = new \Twig\Environment($loader);
    $GLOBALS['twig'] = $twig;
  }

  // initialize autoloading of classes inside of fully-qualified namespaces
  function initAutoloaderClasses(){
    spl_autoload_register(function($class){
      $prefix = 'Blog\\';
      $len = strlen($prefix);
      if (strncmp($prefix, $class, $len) !== 0)
        return;

      $file = __DIR__ . "\\" . str_replace('\\', '/', $class) . '.php';
      if (file_exists($file))
        require $file;

    });
  }

  function getFlash(){
    session_start();
    if(isset($_SESSION['flash'])) {
      $flash = $_SESSION['flash'];
      unset($_SESSION['flash']);
      return $flash;
    }
    return NULL;
  }
 ?>
