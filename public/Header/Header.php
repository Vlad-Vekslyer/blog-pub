<?php
  namespace Blog;
  $header = new \Blog\Template\Template('header.html.twig');
  $header->output(initTwig());
?>
