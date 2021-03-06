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
      // make sure the contribution properties are in the correct format before pushing
      foreach ($_POST as $key => $contribution) {
        if(\preg_match("/contribution-[0-9]/", $key) && $contribution)
          array_push($contributions, $contribution);
      }
      \Blog\Processor\Converter::processContributions($contributions);
      \Blog\Processor\Marker::processContributions($contributions, $article);
      $case = new \Blog\Database\Cases();
      foreach ($contributions as $contribution) {
        $contId = $article->commit($contribution['body'], $title, $_SESSION['username']);
        if($contribution['marked'])
          $case->insert($contId);
      }
      $case->closeConnection();
      $flash = new \Blog\Session\Flash('success', 'Successfully contributed!');
      $flash->serialize();
      http_response_code(303);
    } else {
      $flash = new \Blog\Session\Flash('failure', 'Must be logged in to do that');
      $flash->serialize();
      http_response_code(401);
    }
    header('Location: /articles/view');
    exit();
  }
  // display the view
  $article->getArticle(NULL, function($articleData){
    global $article;
    global $flash;
    $nodeHost = getenv('PHP_ENV') == 'PROD' ? getenv('NODE_HOST') : $_ENV['NODE_HOST'];
    $contributions = $article->getContributions($articleData['id']);
    $pastArticles = $article->getPastArticles();
    $edit = new \Blog\Template\Template('edit.html.twig', [
      'page' => 'edit',
      'flash' => isset($flash) ? $flash : NULL,
      'username' => isset($_SESSION['username']) ? $_SESSION['username'] : NULL,
      'contributions'=>$contributions,
      'article'=>$articleData,
      'nodeHost' => $nodeHost,
      'pastArticles'=>$pastArticles]);
    $edit->output();
  });

  $article->closeConnection();

 ?>
