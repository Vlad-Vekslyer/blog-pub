<?php
  namespace Blog\Processor;

  class Processor {
    static $linerDictionary = array(
        "##" => array("<h1>", "</h1>"),
        "%%" => array("<em>", "</em>"),
        "**" => array("<b>", "</b>"));

    static $oneliners = array("##");
    static $multiliners = array("%%", "**");

    public static function processContributions(&$contributions){
      foreach ($contributions as &$value) {
        $value = \htmlspecialchars($value, ENT_QUOTES);
        $firstChars = substr($value, 0, 2);
        if(in_array($firstChars, self::$oneliners)){
          self::processOneliner($firstChars, $value);
          continue;
        }
        foreach(self::$multiliners as $multiliner){
          $pos = -2;
          $count = 1;
          do {
            $pos = strpos($value, $multiliner, $pos + 2);
            if($count++ % 2 == 0 && $pos !== false)
              self::processMultiliner($multiliner, $value);
          } while($pos !== false);
        }
      }
    }

    private static function processOneliner($oneliner, &$contribution){
      $tags = self::$linerDictionary[$oneliner];
      $contribution = substr_replace($contribution, $tags[0], 0, 2);
      $contribution .= $tags[1];
    }

    private static function processMultiliner($multiliner, &$contribution){
      $tags = self::$linerDictionary[$multiliner];
      $pos = strpos($contribution, $multiliner, 0);
      $contribution = substr_replace($contribution, $tags[0], $pos, 2);
      $pos = strpos($contribution, $multiliner, 0);
      $contribution = substr_replace($contribution, $tags[1], $pos, 2);
    }
  }
?>
