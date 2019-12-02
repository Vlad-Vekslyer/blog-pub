<?php
  namespace Blog;
  require_once "../../src/Initializer.php";
  initialize();
  $article = new \Blog\Database\Article();

  $contributions = array(
    "contribution-1" => "##Hello this is a header contribution",
    "contribution-2" => "This is an %%emphasis%% contribution",
    "contribution-3" => "This is a **bold** contribution",
    "contribution-4" => "**Another** %%one%%"
  );

  \Blog\Processor\Processor::processContributions($contributions);

  print_r($contributions);

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
