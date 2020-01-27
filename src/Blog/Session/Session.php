<?php
  namespace Blog\Session;

  interface Session {
    public function serialize();
    public static function deserialize();
  }

?>
