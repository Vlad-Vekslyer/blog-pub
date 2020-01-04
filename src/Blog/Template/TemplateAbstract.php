<?php
  namespace Blog\Template;

  abstract class TemplaceAbstract{
    protected $template;
    protected $varlist;

    function __construct($template, $varlist = null){
      $this->template = $template;
      $this->varlist = $varlist;
    }

    public abstract function output();
  }
?>
