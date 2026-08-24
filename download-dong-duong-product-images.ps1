$ErrorActionPreference = "Stop"
$imageDir = Join-Path (Get-Location) "public\images"
New-Item -ItemType Directory -Force -Path $imageDir | Out-Null

Write-Host "Downloading dong-duong-product-01.png..."
curl.exe -L --fail "https://www.figma.com/api/mcp/asset/09933773-c7c4-4338-96ef-d6bf463cdc88.png" -o (Join-Path $imageDir "dong-duong-product-01.png")
if ($LASTEXITCODE -ne 0) { throw "Download failed." }

Write-Host "Downloading dong-duong-product-02.png..."
curl.exe -L --fail "https://www.figma.com/api/mcp/asset/e672f66e-7f9d-4b3b-8ac9-e2af529de467.png" -o (Join-Path $imageDir "dong-duong-product-02.png")
if ($LASTEXITCODE -ne 0) { throw "Download failed." }

Write-Host "Downloading dong-duong-product-03.png..."
curl.exe -L --fail "https://www.figma.com/api/mcp/asset/d418097f-21cb-4016-b9a3-d07383aaed77.png" -o (Join-Path $imageDir "dong-duong-product-03.png")
if ($LASTEXITCODE -ne 0) { throw "Download failed." }

Write-Host "Downloading dong-duong-product-04.png..."
curl.exe -L --fail "https://www.figma.com/api/mcp/asset/6b7a4e12-bbae-4290-af6d-05415f68ab23.png" -o (Join-Path $imageDir "dong-duong-product-04.png")
if ($LASTEXITCODE -ne 0) { throw "Download failed." }

Write-Host "Downloading dong-duong-product-05.png..."
curl.exe -L --fail "https://www.figma.com/api/mcp/asset/bf9bdd16-6fe5-493b-99fc-defe248ceca1.png" -o (Join-Path $imageDir "dong-duong-product-05.png")
if ($LASTEXITCODE -ne 0) { throw "Download failed." }

Write-Host "Downloading dong-duong-product-06.png..."
curl.exe -L --fail "https://www.figma.com/api/mcp/asset/fe8c2d16-42b5-487f-9af6-020d9cfb445b.png" -o (Join-Path $imageDir "dong-duong-product-06.png")
if ($LASTEXITCODE -ne 0) { throw "Download failed." }

Write-Host "Downloading dong-duong-product-07.png..."
curl.exe -L --fail "https://www.figma.com/api/mcp/asset/3c2ab1fc-49d1-4432-a90c-b8271bc14b1f.png" -o (Join-Path $imageDir "dong-duong-product-07.png")
if ($LASTEXITCODE -ne 0) { throw "Download failed." }

Write-Host "Downloading dong-duong-product-08.png..."
curl.exe -L --fail "https://www.figma.com/api/mcp/asset/98ad35a3-0707-42b6-baff-b943bf5d8c59.png" -o (Join-Path $imageDir "dong-duong-product-08.png")
if ($LASTEXITCODE -ne 0) { throw "Download failed." }

Write-Host "Downloading dong-duong-product-09.png..."
curl.exe -L --fail "https://www.figma.com/api/mcp/asset/5e1e1dc7-b2cf-4a60-bf99-6b4af48ff2ed.png" -o (Join-Path $imageDir "dong-duong-product-09.png")
if ($LASTEXITCODE -ne 0) { throw "Download failed." }

Write-Host "Downloading dong-duong-product-10.png..."
curl.exe -L --fail "https://www.figma.com/api/mcp/asset/6d9c7c75-6bd0-43ff-9050-67a3440ad373.png" -o (Join-Path $imageDir "dong-duong-product-10.png")
if ($LASTEXITCODE -ne 0) { throw "Download failed." }

Write-Host "Downloading dong-duong-product-11.png..."
curl.exe -L --fail "https://www.figma.com/api/mcp/asset/c922d593-bfa1-4dbe-a563-9fd8b1e5bccc.png" -o (Join-Path $imageDir "dong-duong-product-11.png")
if ($LASTEXITCODE -ne 0) { throw "Download failed." }

Write-Host "Downloading dong-duong-product-12.png..."
curl.exe -L --fail "https://www.figma.com/api/mcp/asset/31eb45b8-4924-49f1-a9fd-ad86ea96a893.png" -o (Join-Path $imageDir "dong-duong-product-12.png")
if ($LASTEXITCODE -ne 0) { throw "Download failed." }

Write-Host "DONE - 12 Dong Duong product images saved to public/images" -ForegroundColor Green