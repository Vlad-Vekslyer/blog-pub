<?php
  namespace Blog;
  require_once "../../src/Initializer.php";
  initialize();
  require_once "../Header/Header.php";
  $article = new \Blog\Database\Article();

  if (isset($_POST['contribution'])){
    $title = isset($_POST['title']) ? $_POST['title'] : null;
    $article->commit($_POST['contribution'], $title);
  }

  $article->getLatestArticle(function($articleData){
    global $article;
    $contributions = $article->getContributions($articleData['id']);
    $edit = new \Blog\Template\Template('edit.html.twig', ['contributions'=>$contributions, 'article'=>$articleData]);
    $edit->output();
  });
  $article->closeConnection();

 ?>
