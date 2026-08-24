$ErrorActionPreference = "Stop"
$imageDir = Join-Path (Get-Location) "public\images"
New-Item -ItemType Directory -Force -Path $imageDir | Out-Null

Write-Host "Downloading tan-co-dien-product-01.png..."
curl.exe -L --fail "https://www.figma.com/api/mcp/asset/aca468b3-af61-4e25-b6c0-4ca616f0ff3b.png" -o (Join-Path $imageDir "tan-co-dien-product-01.png")
if ($LASTEXITCODE -ne 0) { throw "Download failed." }

Write-Host "Downloading tan-co-dien-product-02.png..."
curl.exe -L --fail "https://www.figma.com/api/mcp/asset/b0ccc65e-8d2f-4020-b3b3-acea0bfe0fab.png" -o (Join-Path $imageDir "tan-co-dien-product-02.png")
if ($LASTEXITCODE -ne 0) { throw "Download failed." }

Write-Host "Downloading tan-co-dien-product-03.png..."
curl.exe -L --fail "https://www.figma.com/api/mcp/asset/9f81d5ac-b663-4251-ad76-ab50b49141df.png" -o (Join-Path $imageDir "tan-co-dien-product-03.png")
if ($LASTEXITCODE -ne 0) { throw "Download failed." }

Write-Host "Downloading tan-co-dien-product-04.png..."
curl.exe -L --fail "https://www.figma.com/api/mcp/asset/b7306a48-21f6-4f40-84b7-9769ebd13cfe.png" -o (Join-Path $imageDir "tan-co-dien-product-04.png")
if ($LASTEXITCODE -ne 0) { throw "Download failed." }

Write-Host "Downloading tan-co-dien-product-05.png..."
curl.exe -L --fail "https://www.figma.com/api/mcp/asset/494b1b8e-c3bb-4ea1-9be8-2af4c62ef40e.png" -o (Join-Path $imageDir "tan-co-dien-product-05.png")
if ($LASTEXITCODE -ne 0) { throw "Download failed." }

Write-Host "Downloading tan-co-dien-product-06.png..."
curl.exe -L --fail "https://www.figma.com/api/mcp/asset/e28c6081-44f3-4b3e-8a64-26247390e82f.png" -o (Join-Path $imageDir "tan-co-dien-product-06.png")
if ($LASTEXITCODE -ne 0) { throw "Download failed." }

Write-Host "Downloading tan-co-dien-product-07.png..."
curl.exe -L --fail "https://www.figma.com/api/mcp/asset/a3e935c8-4954-4321-a7bd-7d4fd0db0189.png" -o (Join-Path $imageDir "tan-co-dien-product-07.png")
if ($LASTEXITCODE -ne 0) { throw "Download failed." }

Write-Host "Downloading tan-co-dien-product-08.png..."
curl.exe -L --fail "https://www.figma.com/api/mcp/asset/80bdb35a-3241-4d37-b98d-b481f2133436.png" -o (Join-Path $imageDir "tan-co-dien-product-08.png")
if ($LASTEXITCODE -ne 0) { throw "Download failed." }

Write-Host "Downloading tan-co-dien-product-09.png..."
curl.exe -L --fail "https://www.figma.com/api/mcp/asset/117d5053-a3c9-4ed8-85ca-64eb007ae0c7.png" -o (Join-Path $imageDir "tan-co-dien-product-09.png")
if ($LASTEXITCODE -ne 0) { throw "Download failed." }

Write-Host "Downloading tan-co-dien-product-10.png..."
curl.exe -L --fail "https://www.figma.com/api/mcp/asset/cacf1f6e-8e6b-41d5-acb1-d8cccfeefdcb.png" -o (Join-Path $imageDir "tan-co-dien-product-10.png")
if ($LASTEXITCODE -ne 0) { throw "Download failed." }

Write-Host "Downloading tan-co-dien-product-11.png..."
curl.exe -L --fail "https://www.figma.com/api/mcp/asset/b1d07b5e-49fd-4993-ad98-3ca094dc04fe.png" -o (Join-Path $imageDir "tan-co-dien-product-11.png")
if ($LASTEXITCODE -ne 0) { throw "Download failed." }

Write-Host "Downloading tan-co-dien-product-12.png..."
curl.exe -L --fail "https://www.figma.com/api/mcp/asset/065c63fd-fe5a-4b24-9e0e-4aa7eae91e0a.png" -o (Join-Path $imageDir "tan-co-dien-product-12.png")
if ($LASTEXITCODE -ne 0) { throw "Download failed." }

Write-Host "DONE - 12 Tan Co Dien product images saved to public/images" -ForegroundColor Green