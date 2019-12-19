<?php
  namespace Blog;
  require_once "../../src/Initializer.php";
  initialize();
  $article = new \Blog\Database\Article();

  $article->getLatestArticle(function($articleData) {
    global $article;
    $contributions = $article->getContributions($articleData['id']);
    $view = new \Blog\Template\Template('view.html.twig', ['contributions' => $contributions]);
    $view->output();
  });
  $article->closeConnection();
?>
