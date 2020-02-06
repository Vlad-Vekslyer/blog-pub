<?php
  namespace Blog;
  require_once "../src/Initializer.php";
  initialize();
  $article = new \Blog\Database\Article();
  $flash = \Blog\Session\Flash::deserialize();

  $article->getPastArticles(function ($pastArticles) {
    global $flash;
    $landing = new \Blog\Template\Template('landing.html.twig', [
      'page' => 'landing',
      'flash' => isset($flash) ? $flash : NULL,
      'pastArticles' => $pastArticles,
      'username' => isset($_SESSION['username']) ? $_SESSION['username'] : NULL
    ]);
    $landing->output();
  })
?>
