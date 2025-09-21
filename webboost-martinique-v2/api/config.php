<?php
// Common config for API endpoints (02switch)
header('Content-Type: application/json; charset=UTF-8');
// Load .env from possible locations
function loadEnv(){
  $candidates=[__DIR__.'/.env', __DIR__.'/../.env', dirname(__DIR__).'/.env'];
  foreach($candidates as $p){
    if(file_exists($p)){
      $lines=file($p, FILE_IGNORE_NEW_LINES|FILE_SKIP_EMPTY_LINES);
      foreach($lines as $line){
        if(strpos(trim($line),'#')===0) continue; // comment
        $parts=explode('=',$line,2); if(count($parts)!==2) continue;
        $k=trim($parts[0]); $v=trim($parts[1], " \t\n\r\0\x0B\"'");
        $_ENV[$k]=$v; putenv("$k=$v");
      }
      return true;
    }
  }
  return false;
}
loadEnv();

// CORS allowlist
$allowed = isset($_ENV['ALLOWED_ORIGINS']) ? explode(',', $_ENV['ALLOWED_ORIGINS']) : [];
$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
if($origin && in_array($origin, $allowed)){
  header('Access-Control-Allow-Origin: '.$origin);
}
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Max-Age: 86400');
if($_SERVER['REQUEST_METHOD']==='OPTIONS'){ http_response_code(204); exit; }

// Security headers
header('X-Frame-Options: DENY');
header('X-Content-Type-Options: nosniff');
header('X-XSS-Protection: 1; mode=block');
header('Strict-Transport-Security: max-age=31536000');

// DB connection (optional)
function getPDO(){
  $host = $_ENV['DB_HOST'] ?? 'localhost';
  $name = $_ENV['DB_NAME'] ?? '';
  $user = $_ENV['DB_USER'] ?? '';
  $pass = $_ENV['DB_PASS'] ?? '';
  if(!$name || !$user) return null;
  $dsn = "mysql:host=$host;dbname=$name;charset=utf8mb4";
  try{ return new PDO($dsn,$user,$pass,[PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION]); }
  catch(Exception $e){ return null; }
}