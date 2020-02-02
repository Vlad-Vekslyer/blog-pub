<?php
  namespace Blog\Processor;
  require_once 'Processor.php';

  class Converter extends Processor{
    // turns custom syntax tags into HTML markup
    public static function processContributions(&$contributions, $article = null){
      foreach ($contributions as &$value) {
        $value = \htmlspecialchars($value, ENT_QUOTES);
        // check if the tag is a one-liner by looking at the first two characters
        $firstChars = substr($value, 0, 2);
        if(in_array($firstChars, self::$oneliners)){
          self::processOneliner($firstChars, $value);
          continue;
        }
        // find the multiliner tags
        foreach(self::$multiliners as $multiliner){
          $pos = -2;
          $count = 1;
          do {
            // find position of the multiliner tags starting from 0
            $pos = strpos($value, $multiliner, $pos + 2);
            // only process if both an opening and a closing multiliner tag are found
            if($count++ % 2 == 0 && $pos !== false)
              self::processMultiliner($multiliner, $value);
          } while($pos !== false); // loop stops when no more multiliner tags can be found
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
