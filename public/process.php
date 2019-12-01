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

  foreach ($contributions as $key => $value) {
    $firstChars = substr($value, 0, 2);
    if(in_array($firstChars, $oneliners)){
      processOneliner($firstChars, $value) . "<br/>";
      continue;
    }
    foreach($multiliners as $multiliner){
      $pos = -2;
      $count = 1;
      do {
        $pos = strpos($value, $multiliner, $pos + 2);
        if($count++ % 2 == 0)
          echo processMultiliner($multiliner, $value) . "<br/>";
      } while($pos !== false);
    }
  }

  function processOneliner($oneliner, $contribution){
    global $linerDictionary;
    $tags = $linerDictionary[$oneliner];
    $newContribution = str_replace($oneliner, $tags[0], $contribution);
    $newContribution .= $tags[1];
    return $newContribution;
  }

  function processMultiliner($multiliner, $contribution){
    global $linerDictionary;
    $tags = $linerDictionary[$multiliner];
    $pos = strpos($contribution, $multiliner, 0);
    $newContribution = substr_replace($contribution, $tags[0], $pos, 2);
    $pos = strpos($newContribution, $multiliner, 0);
    $newContribution = substr_replace($newContribution, $tags[1], $pos, 2);
    return $newContribution;
  }
?>
