<?php
  namespace Blog;
  require_once "../../src/Initializer.php";
  initialize();
  require_once "../Header/Header.php";
  $edit = new \Blog\Template\Template('edit.html.twig');
  $edit->output();

  if (isset($_POST['contribution'])){
    $article = new \Blog\Database\Article();
    $title = isset($_POST['title']) ? $_POST['title'] : null;
    $article->commit($_POST['contribution'], $title);
  }
 ?>
