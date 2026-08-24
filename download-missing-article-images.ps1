$ErrorActionPreference = "Stop"

$imageDir = Join-Path (Get-Location) "public\images"
New-Item -ItemType Directory -Force -Path $imageDir | Out-Null

Write-Host "Downloading article-tan-co-dien-kitchen.png..."
Invoke-WebRequest `
  -Uri "https://www.figma.com/api/mcp/asset/ef64a080-9e73-400d-b436-0bfc2d3cf81f.png" `
  -OutFile (Join-Path $imageDir "article-tan-co-dien-kitchen.png")

Write-Host "Downloading article-tan-co-dien-bathroom.png..."
Invoke-WebRequest `
  -Uri "https://www.figma.com/api/mcp/asset/c6e9dccb-92b2-47bd-a4e8-d43454224be1.png" `
  -OutFile (Join-Path $imageDir "article-tan-co-dien-bathroom.png")

Write-Host ""
Write-Host "DONE - 2 missing article images saved to public/images" -ForegroundColor Green
