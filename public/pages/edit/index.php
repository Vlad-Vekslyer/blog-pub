<?php
  namespace Blog;
  session_start();
  require_once "../../../src/Initializer.php";
  initialize();
  $article = new \Blog\Database\Article();

  if (isset($_POST['contribution-1'])){
    $contributions = array();
    $title = isset($_POST['title']) ? $_POST['title'] : null;
    foreach ($_POST as $key => $contribution) {
      if(\preg_match("/contribution-[0-9]/", $key))
        array_push($contributions, $contribution);
    }
    \Blog\Processor\Processor::processContributions($contributions);
    foreach ($contributions as $contribution) {
      $article->commit($contribution, $title);
    }
  }

  $article->getLatestArticle(function($articleData){
    if(isset($_SESSION['flash'])){
      $flash = new \Blog\Flash\Flash($_SESSION['flash']['code'], $_SESSION['flash']['msg']);
      unset($_SESSION['flash']);
    }

    global $article;
    $contributions = $article->getContributions($articleData['id']);
    $pastArticles = $article->getPastArticles();
    $edit = new \Blog\Template\Template('edit.html.twig', [
      'flash' => isset($flash) ? $flash->produceMarkup() : NULL,
      'username' => isset($_SESSION['username']) ? $_SESSION['username'] : NULL,
      'contributions'=>$contributions,
      'article'=>$articleData,
      'pastArticles'=>$pastArticles]);
    $edit->output();
  });

  $article->closeConnection();

 ?>
