<?php
require_once __DIR__.'/config.php';

$input = json_decode(file_get_contents('php://input'), true);
if(!$input){ http_response_code(400); echo json_encode(['success'=>false,'error'=>'Invalid JSON']); exit; }

$pack = isset($input['pack']) ? preg_replace('/[^a-zA-Z0-9_-]/','', $input['pack']) : '';
$options = isset($input['options']) && is_array($input['options']) ? $input['options'] : [];
$name = trim($input['name'] ?? '');
$email = trim($input['email'] ?? '');
$phone = trim($input['phone'] ?? '');
$company = trim($input['company'] ?? '');
$details = trim($input['details'] ?? '');
$budget = trim($input['budget'] ?? '');
$deadline = trim($input['deadline'] ?? '');
$consent = !!($input['consent'] ?? false);

if(!$pack || !$name || !$email || !$details){
  http_response_code(400);
  echo json_encode(['success'=>false,'error'=>'pack, name, email, details are required']);
  exit;
}
if(!filter_var($email, FILTER_VALIDATE_EMAIL)){
  http_response_code(400);
  echo json_encode(['success'=>false,'error'=>'Invalid email']);
  exit;
}

// Try DB if configured
$pdo = getPDO();
$orderId = null;
if($pdo){
  try{
    $pdo->exec("CREATE TABLE IF NOT EXISTS orders (
      id INT AUTO_INCREMENT PRIMARY KEY,
      pack VARCHAR(64),
      options_json TEXT,
      name VARCHAR(120), email VARCHAR(180), phone VARCHAR(60), company VARCHAR(160),
      details TEXT, budget VARCHAR(80), deadline VARCHAR(80), consent TINYINT(1) DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    $stmt = $pdo->prepare("INSERT INTO orders(pack, options_json, name, email, phone, company, details, budget, deadline, consent) VALUES (?,?,?,?,?,?,?,?,?,?)");
    $stmt->execute([$pack, json_encode($options), $name, $email, $phone, $company, $details, $budget, $deadline, $consent?1:0]);
    $orderId = $pdo->lastInsertId();
  }catch(Exception $e){ /* silent to allow fallback */ }
}

// Try email if configured
$to = $_ENV['EMAIL_TO'] ?? '';
if($to){
  $subject = "[WebBoost] Nouvelle commande ($pack)";
  $body = "Pack: $pack\nOptions: ".json_encode($options)."\n\nClient: $name\nEmail: $email\nPhone: $phone\nSociété: $company\n\nBudget: $budget\nDeadline: $deadline\n\nDétails:\n$details\n\nConsentement: ".($consent?'Oui':'Non')."\n";
  $headers = 'From: noreply@weboostmartinique.com' . "\r\n" . 'Reply-To: '.$email . "\r\n" . 'X-Mailer: PHP/' . phpversion();
  @mail($to,$subject,$body,$headers);
}

echo json_encode(['success'=>true,'order_id'=>$orderId, 'message'=>'Order received']);