<?php
  namespace Blog;
  require_once "../../../src/Initializer.php";
  initialize();

  if(isset($_POST['contributions'])){
    // processContributions can only accept an array
    $contributions = [$_POST['contributions']];
    \Blog\Processor\Converter::processContributions($contributions);
    $json = json_encode(array('contributions' => $contributions));
    echo $json;
  }

 ?>
