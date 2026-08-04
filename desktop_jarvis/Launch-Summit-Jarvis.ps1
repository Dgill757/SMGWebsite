param([switch]$InstallShortcut)

$jarvisUrl = "https://avastudio.summitvoiceai.com/?tab=jarvis#jarvis"
$browserCandidates = @(
    "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe",
    "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe",
    "$env:ProgramFiles\Google\Chrome\Application\chrome.exe",
    "$env:LOCALAPPDATA\Google\Chrome\Application\chrome.exe"
)
$browser = $browserCandidates | Where-Object { Test-Path -LiteralPath $_ } | Select-Object -First 1

if (-not $browser) {
    throw "Microsoft Edge or Google Chrome is required for desktop Jarvis."
}

if ($InstallShortcut) {
    $desktop = [Environment]::GetFolderPath("Desktop")
    $shortcutPath = Join-Path $desktop "Summit JARVIS.lnk"
    $shell = New-Object -ComObject WScript.Shell
    $shortcut = $shell.CreateShortcut($shortcutPath)
    $shortcut.TargetPath = $browser
    $shortcut.Arguments = "--app=$jarvisUrl --start-maximized"
    $shortcut.WorkingDirectory = Split-Path $browser
    $shortcut.Description = "Open the SummitOS JARVIS Command Center"
    $shortcut.Save()
    Write-Output "Installed desktop shortcut: $shortcutPath"
    exit 0
}

Start-Process -FilePath $browser -ArgumentList "--app=$jarvisUrl", "--start-maximized"
