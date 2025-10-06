<?php
require_once __DIR__.'/config.php';

$input = json_decode(file_get_contents('php://input'), true);
if (!$input || !isset($input['message'])) {
  http_response_code(400);
  echo json_encode(['success'=>false,'error'=>'Message required']);
  exit;
}

$userMessage = trim($input['message']);
$sessionId = $input['session_id'] ?? ('sess_'.bin2hex(random_bytes(8)));
if($userMessage===''){ http_response_code(400); echo json_encode(['success'=>false,'error'=>'Empty message']); exit; }

$pdo = getPDO();
if($pdo){
  $stmt = $pdo->prepare("CREATE TABLE IF NOT EXISTS chat_history (id INT AUTO_INCREMENT PRIMARY KEY, session_id VARCHAR(64), role VARCHAR(16), message TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)");
  $stmt->execute();
  $s = $pdo->prepare("INSERT INTO chat_history(session_id, role, message) VALUES(?,?,?)");
  $s->execute([$sessionId,'user',$userMessage]);
}

// Load OpenAI key
$rawKey = $_ENV['OPENAI_API_KEY'] ?? getenv('OPENAI_API_KEY') ?? '';
$openaiKey = trim($rawKey, " \t\n\r\x0B\"'");

// Persona
$elisePersona = <<<EOT
Tu es Élise Morel, conseillère WebBoost Martinique. Ton ton est chaleureux, pro et local.
Objectif: aider l'interlocuteur à choisir un pack et avancer. Rappelle les garanties, délais 7-12j, paiement 50/40/10, SEO local et performance.
Structure: 1) engagement 2) analyse rapide 3) proposition claire 4) preuve/garantie 5) CTA.
EOT;

$messages = [
  ['role'=>'system','content'=>$elisePersona],
  ['role'=>'user','content'=>$userMessage]
];

if($openaiKey && preg_match('/^sk-[A-Za-z0-9_\-]{20,}/',$openaiKey)){
  try{
    $payload = [
      'model' => 'gpt-4o-mini',
      'messages' => $messages,
      'temperature' => 0.7,
      'max_tokens' => 800
    ];
    $ch = curl_init('https://api.openai.com/v1/chat/completions');
    curl_setopt_array($ch,[
      CURLOPT_POST=>true,
      CURLOPT_POSTFIELDS=>json_encode($payload),
      CURLOPT_HTTPHEADER=>[
        'Authorization: Bearer '.$openaiKey,
        'Content-Type: application/json'
      ],
      CURLOPT_RETURNTRANSFER=>true,
      CURLOPT_TIMEOUT=>25
    ]);
    $response = curl_exec($ch);
    $http = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $err = curl_error($ch);
    curl_close($ch);

    if($err){ throw new Exception('cURL: '.$err); }
    if($http!==200){ throw new Exception('OpenAI HTTP '.$http.' => '.$response); }

    $data = json_decode($response,true);
    $text = $data['choices'][0]['message']['content'] ?? '';
    if($text===''){ throw new Exception('Réponse OpenAI vide'); }

    if($pdo){ $s=$pdo->prepare("INSERT INTO chat_history(session_id,role,message) VALUES(?,?,?)"); $s->execute([$sessionId,'assistant',$text]); }

    echo json_encode(['success'=>true,'response'=>trim($text),'provider'=>'openai','model'=>'gpt-4o-mini','session_id'=>$sessionId,'timestamp'=>date('c')]);
    exit;
  }catch(Exception $e){
    error_log('[chat.php] '.$e->getMessage());
  }
}

// Fallback (no key or error)
$fallback = "Désolée, je ne suis pas dispo pour le moment. Écrivez-nous par WhatsApp : https://wa.me/596000000";
if($pdo){ $s=$pdo->prepare("INSERT INTO chat_history(session_id,role,message) VALUES(?,?,?)"); $s->execute([$sessionId,'assistant',$fallback]); }

echo json_encode(['success'=>true,'response'=>$fallback,'provider'=>'elise_local','model'=>'fallback','session_id'=>$sessionId,'timestamp'=>date('c')]);