<?php
  namespace Blog;
  require_once "../../src/Initializer.php";
  initialize();
  $flash = getFlash();

  $landing = new \Blog\Template\Template('landing.html.twig', [
    'page' => 'landing',
    'flash' => isset($flash) ? $flash : NULL,
    'username' => isset($_SESSION['username']) ? $_SESSION['username'] : NULL
  ]);
  $landing->output();
?>
