<?php
  namespace Blog\Template;
  require_once 'TemplateAbstract.php';

  class Template extends TemplateAbstract {
    public function output(){
      $twig = $GLOBALS['twig'];
      if($this->varlist)
        echo $twig->render($this->template, $this->varlist);
      else
        echo $twig->render($this->template);
    }
  }
?>
