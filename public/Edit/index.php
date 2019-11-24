<?php
  namespace Blog;
  require_once "../../src/Initializer.php";
  initialize();
  require_once "../Header/Header.php";
  $edit = new \Blog\Template\Template('edit.html.twig');
  $edit->output();
 ?>
