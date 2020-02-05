<?php
  namespace Blog\Database;
  class Database {
    protected $connection;

    protected function __construct(){
      if (getenv('PHP_ENV') == 'PROD')
        $this->connection = new \mysqli(getenv('DB_HOST'), getenv('DB_USER'), getenv('DB_PASSWORD'), getenv('DB_NAME'));
      else
        $this->connection = new \mysqli($_ENV['DB_HOST'], $_ENV['DB_USER'], $_ENV['DB_PASSWORD'], $_ENV['DB_NAME']);
    }

    public function closeConnection(){
       if($this->connection)
         $this->connection->close();
    }
  }
 ?>
