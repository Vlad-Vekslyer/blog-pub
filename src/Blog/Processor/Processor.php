<?php
  namespace Blog\Processor;

  abstract class Processor {
    static protected $linerDictionary = array(
        "##" => array("<h2>", "</h2>"),
        "%%" => array("<em>", "</em>"),
        "**" => array("<b>", "</b>"));

    static protected $oneliners = array("##");
    static protected $multiliners = array("%%", "**");

    public static abstract function processContributions(&$contributions, $article = null);

    // take an array of strings and remove all html characters from it
    public static function clean($str_arr){
      $decoded = array();
      foreach($str_arr as $str)
        array_push($decoded, htmlspecialchars_decode($str, ENT_QUOTES));
      $stripped = array();
      foreach($decoded as $str)
        array_push($stripped, \strip_tags($str));
      return $stripped;
    }
  }

 ?>
