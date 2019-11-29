<?php
  namespace Blog;

  $article->getPastArticles(function($articles){
    $sidebar = new \Blog\Template\Template("partials/sidebar.html.twig", ['articles'=>$articles]);
    $sidebar->output();
  });
?>
