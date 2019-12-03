<?php
  namespace Blog;
  require_once "../../src/Initializer.php";
  initialize();
  $article = new \Blog\Database\Article();

  if (isset($_POST['contribution'])){
    $title = isset($_POST['title']) ? $_POST['title'] : null;
    $article->commit($_POST['contribution'], $title);
  }

  $article->getLatestArticle(function($articleData){
    global $article;
    $contributions = $article->getContributions($articleData['id']);
    $pastArticles = $article->getPastArticles();
    $edit = new \Blog\Template\Template('edit.html.twig', [
      'contributions'=>$contributions,
      'article'=>$articleData,
      'pastArticles'=>$pastArticles]);
    $edit->output();
  });
  $article->closeConnection();

 ?>
