<?php
require_once __DIR__.'/config.php';

// Placeholder endpoint for Phase 2 (tunnel de vente)
if($_SERVER['REQUEST_METHOD']!=='POST'){
  http_response_code(405);
  echo json_encode(['success'=>false,'error'=>'Method not allowed']);
  exit;
}

echo json_encode(['success'=>false,'error'=>'Order API not implemented yet (Phase 2).']);