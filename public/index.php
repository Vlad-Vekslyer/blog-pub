<?php
  namespace Blog;
  require_once "../src/Initializer.php";
  initialize();
  $loader = new \Twig\Loader\FilesystemLoader('../views');
  $twig = new \Twig\Environment($loader);
  $hello = new \Blog\Template\Template('hello.html', ['name' => "Vlad"]);
  $hello->output($twig);
?>
