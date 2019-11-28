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
      $statement = $this->connection->prepare("INSERT INTO contributions VALUES(NULL, ?, 1, {$latestArticle['id']}, NOW)())");
      $statement->bind_param('s', $body);
      $statement->execute() or die($this->connection->error);
    }

    public function getContributions($articleId){
      $statement = $this->connection->prepare("SELECT body,author FROM contributions WHERE article = ? ");
      $statement->bind_param('i', $articleId);
      $contributions = $statement->execute() or die($this->connection->error);
      return $contributions;
    }

    public function getLatestArticle($cb = null){
      $result = $this->connection->query("SELECT * FROM articles ORDER BY date_created DESC LIMIT 1") or die($this->connection->error);
      if($cb == null)
        return $result->fetch_array(MYSQLI_ASSOC);
      else
        $cb($result->fetch_array(MYSQLI_ASSOC));
    }
  }
?>
