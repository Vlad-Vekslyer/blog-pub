<?php
  namespace Blog\Session;
  require_once 'Session.php';

  class Flash implements Session {
    private $code;
    private $msg;

    public function __construct(string $code,string $msg){
      $this->code = $code;
      $this->msg = $msg;
    }

    public function serialize(){
      if(session_status() !== 2)
        session_start();
      $_SESSION['flash'] = [
        'code' => $this->code,
        'msg' => $this->msg
      ];
    }

    public static function deserialize(){
      if(session_status() !== 2)
        session_start();
      if(isset($_SESSION['flash'])) {
        $flash = $_SESSION['flash'];
        unset($_SESSION['flash']);
        return $flash;
      }
      return NULL;
    }
  }
?>
