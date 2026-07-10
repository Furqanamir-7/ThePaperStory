$ErrorActionPreference = 'Continue'
$log = Join-Path $PSScriptRoot 'deploy-result.log'
Remove-Item $log -ErrorAction SilentlyContinue

function Log($msg) {
  $line = "$(Get-Date -Format o) $msg"
  Add-Content -Path $log -Value $line
}

Set-Location $PSScriptRoot
Log 'START'

$src = 'C:\Users\Dell\Desktop\THE PAPER STORY META IMAGE.png'
$dst = Join-Path $PSScriptRoot 'public\meta-image.png'
if (Test-Path $src) {
  Copy-Item $src $dst -Force
  Log "COPIED_META $((Get-Item $dst).Length)"
} elseif (Test-Path $dst) {
  Log "META_EXISTS $((Get-Item $dst).Length)"
} else {
  Log 'META_MISSING'
}

npm run build 2>&1 | ForEach-Object { Log "BUILD $_" }
if ($LASTEXITCODE -ne 0) {
  Log "BUILD_FAIL $LASTEXITCODE"
  exit $LASTEXITCODE
}
Log 'BUILD_OK'

npx vercel --prod --yes 2>&1 | ForEach-Object { Log "VERCEL $_" }
Log "VERCEL_EXIT $LASTEXITCODE"

try {
  $meta = Invoke-WebRequest -Uri 'https://www.thepaperstory.store/meta-image.png' -Method Head -UseBasicParsing
  Log "META_STATUS $($meta.StatusCode) $($meta.Headers['Content-Type'])"
} catch {
  Log "META_CHECK_FAIL $($_.Exception.Message)"
}

try {
  $home = Invoke-WebRequest -Uri 'https://www.thepaperstory.store/' -UseBasicParsing
  if ($home.Content -match 'og:image') {
    Log "OG_FOUND $($Matches[0])"
  } else {
    Log 'OG_MISSING'
  }
} catch {
  Log "HOME_CHECK_FAIL $($_.Exception.Message)"
}

Log 'DONE'
