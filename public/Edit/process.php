<?php
  namespace Blog;
  require_once "../../src/Initializer.php";
  initialize();

  $contributions = array(
    "contribution-1" => "##Hello this is a header contribution",
    "contribution-2" => "This is an %%emphasis%% contribution",
    "contribution-3" => "This is a **bold** contribution",
    "contribution-4" => "**Another** %%one%%"
  );

  \Blog\Processor\Processor::processContributions($contributions);
  $json = json_encode($contributions);
  echo $json;
 ?>
