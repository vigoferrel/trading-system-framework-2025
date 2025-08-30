Param(
  [switch]$OpenFirewall
)

Write-Host "Config PM2 startup (needs elevation step)..."
pm2 startup | Out-String | Write-Host
pm2 save | Out-String | Write-Host

if ($OpenFirewall) {
  Write-Host "Opening Windows Firewall for TCP 4601-4604 (requires admin)..."
  try {
    New-NetFirewallRule -DisplayName 'QuantumBot_TCP_In_4601-4604' -Direction Inbound -Action Allow -Protocol 'TCP' -LocalPort '4601-4604' | Out-Null
    Write-Host "Firewall rule created."
  } catch {
    Write-Warning "Firewall rule failed. Run this script in PowerShell as Administrator: scripts/setup-production.ps1 -OpenFirewall"
  }
}

Write-Host "Done."


