<?php
  namespace Blog;
  require_once "../src/Initializer.php";
  initialize();
  require_once "Header/Header.php";
  $landing = new \Blog\Template\Template('landing.html.twig');
  $landing->output();
?>
