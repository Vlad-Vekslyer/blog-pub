<?php
  namespace Blog;
  require_once "../../../src/Initializer.php";
  initialize();
  $article = new \Blog\Database\Article();
  $flash = \Blog\Session\Flash::deserialize();

  if(isset($_GET['id'])){
    $contributions = $article->getContributions($_GET['id']);
    $articleData = $article->getArticle($_GET['id']);
    $pastArticles = $article->getPastArticles();
    $view = new \Blog\Template\Template('view.html.twig', [
      'flash' => isset($flash) ? $flash : NULL,
      'title' => $articleData['title'],
      'page' => 'previous',
      'latest' => FALSE,
      'username' => isset($_SESSION['username']) ? $_SESSION['username'] : NULL,
      'contributions' => $contributions,
      'author' => $articleData['username'],
      'pastArticles' => $pastArticles
    ]);
    $view->output();
  } else {
    $article->getArticle(NULL, function($articleData) {
      global $article;
      global $flash;
      $pastArticles = $article->getPastArticles();
      $contributions = $article->getContributions($articleData['id']);
      $view = new \Blog\Template\Template('view.html.twig', [
        'flash' => isset($flash) ? $flash : NULL,
        'title' => $articleData['title'],
        'author' => $articleData['username'],
        'page' => 'latest',
        'contributions' => $contributions,
        'latest' => TRUE,
        'username' => isset($_SESSION['username']) ? $_SESSION['username'] : NULL,
        'pastArticles' => $pastArticles
      ]);
      $view->output();
    });
  }
  $article->closeConnection();
?>
