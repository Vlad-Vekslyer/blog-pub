<?php
  namespace Blog\Flash;

  class Flash  {
    public function __construct($className, $text){
      $this->className = $className;
      $this->text = $text;
    }

    public function produceMarkup(){
      return "<p class='$className'>$text</p>";
    }
  }

?>
