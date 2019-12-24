<?php
  namespace Blog;
  require_once "../../src/Initializer.php";
  initialize();
  $landing = new \Blog\Template\Template('landing.html.twig');
  $landing->output();
?>
