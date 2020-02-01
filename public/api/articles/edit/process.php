<?php
  namespace Blog;
  require_once "../../../../src/Initializer.php";
  initialize();

  if($_SERVER['REQUEST_METHOD'] == 'POST'){
    $data = (array) \json_decode(\file_get_contents("php://input"));
    $contributions = $data['contributions'];
    \Blog\Processor\Converter::processContributions($contributions);
    $json = json_encode(array('contributions' => $contributions));
    echo $json;
  }

 ?>
