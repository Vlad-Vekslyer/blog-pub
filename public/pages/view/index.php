<?php
  namespace Blog;
  require_once "../../../src/Initializer.php";
  initialize();
  $article = new \Blog\Database\Article();


  if(isset($_GET['id'])){
    $contributions = $article->getContributions($_GET['id']);
    $view = new \Blog\Template\Template('view.html.twig', ['contributions' => $contributions]);
    $view->output();
  } else {
    $article->getLatestArticle(function($articleData) {
      global $article;
      $contributions = $article->getContributions($articleData['id']);
      $view = new \Blog\Template\Template('view.html.twig', [
        'title' => $articleData['title'],
        'page' => 'latest',
        'contributions' => $contributions,
        'latest' => TRUE
      ]);
      $view->output();
    });
  }
  $article->closeConnection();
?>
