<?php
  // the initialize function takes an array of functions and calls each function
  function initialize($initializers = array('initAutoloaderComposer','initAutoloaderClasses')){
    foreach ($initializers as $initializer)
      $initializer();
  }

  // initialize composer autoload
   function initAutoloaderComposer(){
    require_once '../vendor/autoload.php';
  }

  function initTwig(){
    initAutoloaderComposer();
    $loader = new \Twig\Loader\FilesystemLoader('../views');
    $twig = new \Twig\Environment($loader);
    return $twig;
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
      else
        die("File not found at $file");
    });
  }
 ?>
