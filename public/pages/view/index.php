<?php
  namespace Blog;
  require_once "../../../src/Initializer.php";
  initialize();
  $article = new \Blog\Database\Article();
  $flash = getFlash();

  if(isset($_GET['id'])){
    $contributions = $article->getContributions($_GET['id']);
    $view = new \Blog\Template\Template('view.html.twig', ['contributions' => $contributions]);
    $view->output();
  } else {
    $article->getLatestArticle(function($articleData) {
      global $article;
      $contributions = $article->getContributions($articleData['id']);
      $view = new \Blog\Template\Template('view.html.twig', [
        'flash' => isset($flash) ? $flash : NULL,
        'title' => $articleData['title'],
        'author' => $articleData['username'],
        'page' => 'latest',
        'contributions' => $contributions,
        'latest' => TRUE,
        'username' => isset($_SESSION['username']) ? $_SESSION['username'] : NULL
      ]);
      $view->output();
    });
  }
  $article->closeConnection();
?>
