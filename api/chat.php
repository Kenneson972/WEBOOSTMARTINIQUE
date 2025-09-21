<?php
/* chat.php – WebBoost Martinique */

ini_set('display_errors',1);
error_reporting(E_ALL);
ini_set('log_errors',1);

require_once __DIR__.'/config.php';
header('Content-Type: application/json; charset=utf-8');

/* ───── Entrée ───── */
$input = json_decode(file_get_contents('php://input'), true);
if (!$input || !isset($input['message'])) {
    http_response_code(400);
    echo json_encode(['success'=>false,'error'=>'Message required']);
    exit;
}
$userMessage = trim($input['message']);
$sessionId   = $input['session_id'] ?? ('sess_'.bin2hex(random_bytes(8)));
if ($userMessage==='') {
    http_response_code(400);
    echo json_encode(['success'=>false,'error'=>'Empty message']);
    exit;
}

/* ─── Redirection instantanée vers Kenneson ─── */
if (preg_match('/\\b(rendez[ -]?vous|rdv|appointment)\\b/i', $userMessage)) {
    $assistantReply = "Parfait ! Je vous mets en relation directe avec mon responsable "
                    . "Kenneson : WhatsApp +596 696 07 98 92.";
    echo json_encode([
        'success'    => true,
        'response'   => $assistantReply,
        'provider'   => 'human-handoff',
        'model'      => 'rule',
        'session_id' => $sessionId,
        'timestamp'  => date('c')
    ]);
    exit;
}

/* ───── Connexion DB & création table ───── */
$pdo = getPDO();
if ($pdo) {
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    try {
        $pdo->exec("
            CREATE TABLE IF NOT EXISTS chat_history (
                id         INT AUTO_INCREMENT PRIMARY KEY,
                session_id VARCHAR(64),
                role       VARCHAR(16),
                message    TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        ");
    } catch (PDOException $e) {
        error_log('[chat.php] Erreur création table : '.$e->getMessage());
    }

    /* insertion du message utilisateur */
    $ins = $pdo->prepare(
        'INSERT INTO chat_history(session_id,role,message) VALUES(?,?,?)'
    );
    $ins->execute([$sessionId,'user',$userMessage]);
}

/* ───── Historique ───── */
$history = [];
if ($pdo) {
    $sel = $pdo->prepare(
        'SELECT role, message
           FROM chat_history
          WHERE session_id = :s
       ORDER BY id ASC
          LIMIT 50'
    );
    $sel->execute(['s'=>$sessionId]);
    $history = $sel->fetchAll(PDO::FETCH_ASSOC);
}

/* ───── Clé OpenAI ───── */
$openaiKey = trim($_ENV['OPENAI_API_KEY'] ?? getenv('OPENAI_API_KEY') ?? '');
if (!$openaiKey || strpos($openaiKey, 'sk-') !== 0) {
    http_response_code(500);
    echo json_encode(['success'=>false,'error'=>'OPENAI_API_KEY manquante ou invalide']);
    exit;
}

/* ───── Persona Élise ───── */
$elisePersona = <<<EOT
Tu es Élise Morel, conseillère de l’agence WebBoost Martinique.

STYLE
– Ton amical, phrases courtes, pas de listes ni de puces.  
– Ne redis jamais “Bonjour” après le premier échange.  
– Ne repose pas deux fois la même question ; poursuis la discussion.  
– Termine chaque réponse par une question ouverte.

CONTENU
– Tu aides l’utilisateur à choisir entre les packs Essentiel, Vitrine Pro et Vitrine Conversion.  
– Rappelle si besoin : délai 7-12 jours ; paiement 50 / 40 / 10 ; SEO local optimisé.  
– Si l’utilisateur mentionne rendez-vous (rendez-vous, rdv, appointment) :  
  Réponds immédiatement : « Parfait ! Je vous mets en relation directe avec mon responsable Kenneson : WhatsApp +596 696 07 98 92. » Et n’ajoute rien d’autre.  
– Ne mentionne jamais que tu es une IA.
EOT;

/* ───── Construction du contexte ───── */
$messages   = [['role'=>'system','content'=>$elisePersona]];
foreach ($history as $row) {
    $messages[] = ['role'=>$row['role'], 'content'=>$row['message']];
}
$messages[] = ['role'=>'user','content'=>$userMessage];

/* ───── Appel OpenAI ───── */
$payload = [
    'model'       => 'gpt-4o-mini',
    'messages'    => $messages,
    'temperature' => 0.85,
    'max_tokens'  => 800
];

$ch = curl_init('https://api.openai.com/v1/chat/completions');
curl_setopt_array($ch,[
    CURLOPT_POST           => true,
    CURLOPT_POSTFIELDS     => json_encode($payload),
    CURLOPT_HTTPHEADER     => [
        'Authorization: Bearer '.$openaiKey,
        'Content-Type: application/json'
    ],
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT        => 45,
    CURLOPT_CONNECTTIMEOUT => 10
]);
$response = curl_exec($ch);
$http     = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$err      = curl_error($ch);
curl_close($ch);

if ($err) {
    http_response_code(502);
    echo json_encode(['success'=>false,'error'=>'cURL error: '.$err]);
    exit;
}
if ($http !== 200) {
    http_response_code($http ?: 500);
    echo json_encode(['success'=>false,'error'=>'OpenAI HTTP '.$http,'body'=>$response]);
    exit;
}

$data = json_decode($response, true);
$assistantReply = $data['choices'][0]['message']['content'] ?? '';
if ($assistantReply==='') {
    http_response_code(502);
    echo json_encode(['success'=>false,'error'=>'Réponse OpenAI vide','body'=>$response]);
    exit;
}

/* ───── Sauvegarde de la réponse ───── */
if ($pdo) {
    $ins = $pdo->prepare(
        'INSERT INTO chat_history(session_id,role,message) VALUES(?,?,?)'
    );
    $ins->execute([$sessionId,'assistant',$assistantReply]);
}

/* ───── Sortie ───── */
echo json_encode([
    'success'    => true,
    'response'   => trim($assistantReply),
    'provider'   => 'openai',
    'model'      => 'gpt-4o-mini',
    'session_id' => $sessionId,
    'timestamp'  => date('c')
]);
