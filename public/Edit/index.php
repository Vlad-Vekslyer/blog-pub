<?php
  namespace Blog;
  require_once "../../src/Initializer.php";
  initialize();
  $article = new \Blog\Database\Article();

  if (isset($_POST['contribution-1'])){
    $title = isset($_POST['title']) ? $_POST['title'] : null;
    foreach ($_POST as $key => $contribution) {
      if(\preg_match("/contribution-[0-9]/", $key))
        $article->commit($contribution, $title);
    }
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
