<?php
  namespace Blog\Processor;

  abstract class Processor {
    static protected $linerDictionary = array(
        "##" => array("<h2>", "</h2>"),
        "%%" => array("<em>", "</em>"),
        "**" => array("<b>", "</b>"));

    static protected $oneliners = array("##");
    static protected $multiliners = array("%%", "**");

    public static abstract function processContributions(&$contributions);
  }

 ?>
