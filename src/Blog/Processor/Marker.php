<?php
  namespace Blog\Processor;
  require_once 'Processor.php';

  class Marker extends Processor {
    public static function processContributions(&$contributions, $article = null){
      $incoming = self::format($contributions);
      $current = self::getCurrent($article);
      $current = self::format($current);
      $relevancy = self::getRelevancy($incoming, $current);
      foreach($contributions as &$contribution){
        $contribution = array(
          'body' => $contribution,
          'marked' => !$relevancy['isRelevant']
        );
      }
    }

    private static function getRelevancy($incoming, $current){
      $body = [
        'incoming' => $incoming,
        'current' => $current
      ];
      $body = json_encode($body);
      $ch = \curl_init();
      \curl_setopt($ch, CURLOPT_URL, 'https://localhost:3000/compare');
      \curl_setopt($ch, CURLOPT_POSTFIELDS, $body);
      \curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type:application/json'));
      \curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
      \curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
      \curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
      $result = \curl_exec($ch);
      \curl_close($ch);
      return (array) \json_decode($result, true);
    }

    private static function getCurrent($article){
      $latestArticle = $article->getArticle();
      $contributions = $article->getContributions($latestArticle['id']);
      $latestDate = end($contributions)['date'];
      $latestDate = date('dMY', strtotime($latestDate));
      $latestAuthor = end($contributions)['author'];
      $current = array();
      foreach ($contributions as $contribution) {
        $date = date('dMY', strtotime($contribution['date']));
        if($date === $latestDate && $contribution['author'] === $latestAuthor)
          array_push($current, $contribution['body']);
      }
      return $current;
    }

    private static function format($contributions){
      $cleanConts = self::clean($contributions);
      // bring all contribution to a single stirng and split them by '.' or '?'
      $sentences = preg_split("/[.?]/",
      array_reduce($cleanConts, function($carry, $item){
        return $carry . $item;
      }, ''));
      $sentences = array_filter($sentences, function($sentence){
        return strlen($sentence) > 5;
      });
      $sentences = array_map(function($sentence){
        $clean = preg_replace("/\s+/", ' ', $sentence);
        return substr($clean, 0, 1) === " " ? substr($clean, 1) : $clean;
      }, $sentences);
      return $sentences;
    }
  }
?>
