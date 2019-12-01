<?php
  // this is a test implementation of contribution processing
  $oneliners = array("##");
  $multiliners = array("%%", "**");

  $linerDictionary = array(
    "##" => array("<h1>", "</h1>"),
    "%%" => array("<em>", "</em>"),
    "**" => array("<b>", "</b>")
  );

  $contributions = array(
    "contribution-1" => "##Hello this is a header contribution",
    "contribution-2" => "This is an %%emphasis%% contribution",
    "contribution-3" => "This is a **bold** contribution"
  );

  foreach ($contributions as $key => &$value) {
    $firstChars = substr($value, 0, 2);
    if(in_array($firstChars, $oneliners)){
      processOneliner($firstChars, $value);
      continue;
    }
    foreach($multiliners as $multiliner){
      $pos = -2;
      $count = 1;
      do {
        $pos = strpos($value, $multiliner, $pos + 2);
        if($count++ % 2 == 0 && $pos !== false){
          processMultiliner($multiliner, $value);
        }
      } while($pos !== false);
    }
  }

  function processOneliner($oneliner, &$contribution){
    global $linerDictionary;
    $tags = $linerDictionary[$oneliner];
    $contribution = substr_replace($contribution, $tags[0], 0, 2);
    $contribution .= $tags[1];
  }

  function processMultiliner($multiliner, &$contribution){
    global $linerDictionary;
    $tags = $linerDictionary[$multiliner];
    $pos = strpos($contribution, $multiliner, 0);
    $contribution = substr_replace($contribution, $tags[0], $pos, 2);
    $pos = strpos($contribution, $multiliner, 0);
    $contribution = substr_replace($contribution, $tags[1], $pos, 2);
  }

  echo $contributions["contribution-1"] . "<br/>";
  echo $contributions["contribution-2"] . "<br/>";
  echo $contributions["contribution-3"] . "<br/>";
?>
