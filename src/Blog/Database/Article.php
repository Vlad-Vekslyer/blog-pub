<?php
  namespace Blog\Database;
  require_once 'Database.php';

  class Article extends Database {
    public function __construct(){
      parent::__construct();
    }

    // commit the user's contribution to the database
    public function commit($body, $title, $author){
      $latestArticle = $this->getLatestArticle();
      // has the current article hasn't received its first contribution yet?
      if(!isset($latestArticle['title'])){
        if($title != null){
          // insert title of article and overwrite the dat  e_created value
          $statement = $this->connection->prepare("UPDATE articles SET
            title = ?,
            date_created = NOW(),
            username = ?
            WHERE id = {$latestArticle['id']}");
          $statement->bind_param('ss', $title, $author);
          $statement->execute() or die($this->connection->error);
          $statement->close();
        } else die("Must include a title");
      }
      $statement = $this->connection->prepare("INSERT INTO contributions VALUES(NULL, ?, {$latestArticle['id']}, NOW(), ?)");
      $statement->bind_param('ss', $body, $author);
      $statement->execute() or die($this->connection->error);
      $statement->close();
    }

    // get all the user contributions of a specific article
    public function getContributions($articleId){
      $statement = $this->connection->prepare("SELECT body,username FROM contributions WHERE article = ? ORDER BY date_created ASC");
      $statement->bind_param('i', $articleId);
      $statement->execute() or die($this->connection->error);
      $statement->bind_result($body, $author);
      $contributions = array();
      while($statement->fetch()){
        array_push($contributions, array("body"=>$body, "author"=>$author));
      }
      return $contributions;
    }

    // get data of the latest article
    public function getLatestArticle($cb = null){
      $result = $this->connection->query("SELECT * FROM articles ORDER BY date_created DESC LIMIT 1") or die($this->connection->error);
      if($cb == null)
        return $result->fetch_array(MYSQLI_ASSOC);
      else
        $cb($result->fetch_array(MYSQLI_ASSOC));
    }

    public function getPastArticles($cb = null){
      $latestArticle = $this->getLatestArticle();
      $result = $this->connection->query("SELECT * FROM articles WHERE date_created
        BETWEEN '2019-11-25' AND DATE('{$latestArticle['date_created']}') ") or die($this->connection->error);
      if($cb == null)
        return $result->fetch_all(MYSQLI_ASSOC);
      else
        $cb($result->fetch_all(MYSQLI_ASSOC));
    }
  }
?>
