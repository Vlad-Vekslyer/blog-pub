<?php
  // this is a test implementation of contribution processing
  $oneliners = array("##");
  $multiliners = array("%%", "**");

  $contributions = array(
    "contribution-1" => "##Hello this is a header contribution",
    "contribution-2" => "This is an %%emphasis%% contribution",
    "contribution-3" => "This is a **bold** contribution"
  );

  foreach ($contributions as $key => $value) {
    $firstChars = substr($value, 0, 2);
    if(in_array($firstChars, $oneliners)){
      echo "I found a header inside of $key <br/>";
      continue;
    }
    foreach($multiliners as $multiliner){
      $pos = -2;
      $count = 1;
      do {
        $pos = strpos($value, $multiliner, $pos + 2);
        if($count++ % 2 == 0)
          echo "I found a multiliner inside of $key <br/>";
      } while($pos !== false);
    }
  }
?>
