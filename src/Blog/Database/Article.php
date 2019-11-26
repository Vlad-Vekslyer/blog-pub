<?php
  namespace Blog\Database;
  require_once 'Database.php';

  class Article extends Database {
    public function __construct(){
      parent::__construct();
    }

    public function commit($body, $title){
      $latestArticle = self::getLatestArticle()->fetch_array(MYSQLI_ASSOC);
      // has the current article hasn't received its first contribution yet?
      if(!isset($latestArticle['title'])){
        if($title != null){
          // insert title of article and overwrite the date_created value
          $statement = $this->connection->prepare("UPDATE articles SET
            title = ?,
            date_created = NOW()
            WHERE id = {$latestArticle['id']}");
          $statement->bind_param('s', $title);
          $statement->execute() or die($this->connection->error);
        } else die("Must include a title");
      }
      $statement = $this->connection->prepare("INSERT INTO contributions VALUES(NULL, ?, 1, {$latestArticle['id']})");
      $statement->bind_param('s', $body);
      $statement->execute() or die($this->connection->error);
    }

    public static function getLatestArticle(){
      $connection = mysqli_connect($_ENV['DB_HOST'], $_ENV['DB_USER'], $_ENV['DB_PASSWORD'], $_ENV['DB_NAME']);
      $result = mysqli_query($connection, "SELECT * FROM articles ORDER BY date_created DESC LIMIT 1");
      mysqli_close($connection);
      return $result;
    }
  }
?>
