$ErrorActionPreference = "Stop"
$projectRoot = "C:\Users\DanGi\Downloads\SummitVoiceAI\SummitOS"
$pythonExe = "C:\Python314\python.exe"
$ollamaExe = "C:\Users\DanGi\AppData\Local\Programs\Ollama\ollama.exe"
$connectorCloudToken = [Environment]::GetEnvironmentVariable("JARVIS_CONNECTOR_CLOUD_TOKEN", "User")
if ($connectorCloudToken) {
    $env:JARVIS_CONNECTOR_CLOUD_TOKEN = $connectorCloudToken
}

if (-not (Get-Process ollama -ErrorAction SilentlyContinue)) {
    Start-Process -FilePath $ollamaExe -ArgumentList "serve" -WindowStyle Hidden
}

$running = Get-CimInstance Win32_Process | Where-Object {
    $_.Name -eq "python.exe" -and $_.CommandLine -like "*jarvis_local_connector.py*"
}
if (-not $running) {
    Start-Process -FilePath $pythonExe -ArgumentList "jarvis_local_connector.py" -WorkingDirectory $projectRoot -WindowStyle Hidden
}
