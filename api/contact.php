<?php
require_once __DIR__.'/config.php';

$input = json_decode(file_get_contents('php://input'), true);
if(!$input){ http_response_code(400); echo json_encode(['success'=>false,'error'=>'Invalid JSON']); exit; }

$name = trim($input['name'] ?? '');
$email = trim($input['email'] ?? '');
$message = trim($input['message'] ?? '');

if($name==='' || $email==='' || $message===''){
  http_response_code(400);
  echo json_encode(['success'=>false,'error'=>'name, email, message are required']);
  exit;
}

if(!filter_var($email, FILTER_VALIDATE_EMAIL)){
  http_response_code(400);
  echo json_encode(['success'=>false,'error'=>'Invalid email']);
  exit;
}

$to = $_ENV['EMAIL_TO'] ?? '';
if(!$to){
  // Si pas de config email, répondre OK pour ne pas bloquer (préprod)
  echo json_encode(['success'=>true,'note'=>'EMAIL_TO not set; message not sent (preview mode)']);
  exit;
}

$subject = "[WebBoost] Nouveau message de contact";
$body = "Nom: $name\nEmail: $email\n\nMessage:\n$message\n";
$headers = 'From: noreply@weboostmartinique.com' . "\r\n" .
           'Reply-To: '.$email . "\r\n" .
           'X-Mailer: PHP/' . phpversion();

$sent = @mail($to, $subject, $body, $headers);

echo json_encode(['success'=>$sent ? true : false]);