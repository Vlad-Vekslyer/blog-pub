<?php
  namespace Blog;
  require_once "../../../src/Initializer.php";
  initialize();
  $article = new \Blog\Database\Article();
  $flash = \Blog\Session\Flash::deserialize();

  // update the database if a logged in user sent a contribution
  if (isset($_POST['contribution-1'])){
    if(isset($_SESSION['username'])) {
      $contributions = array();
      $title = isset($_POST['title']) ? $_POST['title'] : null;
      // make sure the contribution properties are in the correc format before pushing
      foreach ($_POST as $key => $contribution) {
        if(\preg_match("/contribution-[0-9]/", $key))
          array_push($contributions, $contribution);
      }
      \Blog\Processor\Processor::processContributions($contributions);
      foreach ($contributions as $contribution) {
        $article->commit($contribution, $title, $_SESSION['username']);
      }
      header('Location: /');
      exit();
    } else {
      $_SESSION['flash'] = [
        'code' => 'failure',
        'msg' => 'Must be logged in to do that'
      ];
      header('Location: /view');
      exit();
    }
  }

  // display the view
  $article->getArticle(NULL, function($articleData){
    global $article;
    global $flash;
    $contributions = $article->getContributions($articleData['id']);
    $pastArticles = $article->getPastArticles();
    $edit = new \Blog\Template\Template('edit.html.twig', [
      'page' => 'edit',
      'flash' => isset($flash) ? $flash : NULL,
      'username' => isset($_SESSION['username']) ? $_SESSION['username'] : NULL,
      'contributions'=>$contributions,
      'article'=>$articleData,
      'pastArticles'=>$pastArticles]);
    $edit->output();
  });

  $article->closeConnection();

 ?>
