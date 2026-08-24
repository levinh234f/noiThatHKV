$ErrorActionPreference = "Stop"
$imageDir = Join-Path (Get-Location) "public\images"
New-Item -ItemType Directory -Force -Path $imageDir | Out-Null

Write-Host "Downloading hien-dai-product-01.png..."
curl.exe -L --fail "https://www.figma.com/api/mcp/asset/e3d21f0c-205b-4843-8181-29d92c7012c7.png" -o (Join-Path $imageDir "hien-dai-product-01.png")
if ($LASTEXITCODE -ne 0) { throw "Download failed." }

Write-Host "Downloading hien-dai-product-02.png..."
curl.exe -L --fail "https://www.figma.com/api/mcp/asset/3514770a-548a-4b28-b14c-d7763cb84316.png" -o (Join-Path $imageDir "hien-dai-product-02.png")
if ($LASTEXITCODE -ne 0) { throw "Download failed." }

Write-Host "Downloading hien-dai-product-03.png..."
curl.exe -L --fail "https://www.figma.com/api/mcp/asset/bf5a3b19-5336-4653-a89b-702dc2fbe61f.png" -o (Join-Path $imageDir "hien-dai-product-03.png")
if ($LASTEXITCODE -ne 0) { throw "Download failed." }

Write-Host "Downloading hien-dai-product-04.png..."
curl.exe -L --fail "https://www.figma.com/api/mcp/asset/37932d27-4f8b-402a-87e8-fded42313ccf.png" -o (Join-Path $imageDir "hien-dai-product-04.png")
if ($LASTEXITCODE -ne 0) { throw "Download failed." }

Write-Host "Downloading hien-dai-product-05.png..."
curl.exe -L --fail "https://www.figma.com/api/mcp/asset/ba5950f6-ec8b-45cd-a2c0-8a1f655ec117.png" -o (Join-Path $imageDir "hien-dai-product-05.png")
if ($LASTEXITCODE -ne 0) { throw "Download failed." }

Write-Host "Downloading hien-dai-product-06.png..."
curl.exe -L --fail "https://www.figma.com/api/mcp/asset/fd7ef309-d372-4f44-8e27-eec04477a2da.png" -o (Join-Path $imageDir "hien-dai-product-06.png")
if ($LASTEXITCODE -ne 0) { throw "Download failed." }

Write-Host "Downloading hien-dai-product-07.png..."
curl.exe -L --fail "https://www.figma.com/api/mcp/asset/95d21518-1bff-4a22-b416-576b0caba5bb.png" -o (Join-Path $imageDir "hien-dai-product-07.png")
if ($LASTEXITCODE -ne 0) { throw "Download failed." }

Write-Host "Downloading hien-dai-product-08.png..."
curl.exe -L --fail "https://www.figma.com/api/mcp/asset/d0e4bdc8-3fe9-4cc5-856e-8f78e6501870.png" -o (Join-Path $imageDir "hien-dai-product-08.png")
if ($LASTEXITCODE -ne 0) { throw "Download failed." }

Write-Host "Downloading hien-dai-product-09.png..."
curl.exe -L --fail "https://www.figma.com/api/mcp/asset/52d09736-3f94-4d84-8e84-27c4f2b0fb2f.png" -o (Join-Path $imageDir "hien-dai-product-09.png")
if ($LASTEXITCODE -ne 0) { throw "Download failed." }

Write-Host "Downloading hien-dai-product-10.png..."
curl.exe -L --fail "https://www.figma.com/api/mcp/asset/91582cf9-e4da-41e1-a018-e2fa2ffc4ca6.png" -o (Join-Path $imageDir "hien-dai-product-10.png")
if ($LASTEXITCODE -ne 0) { throw "Download failed." }

Write-Host "Downloading hien-dai-product-11.png..."
curl.exe -L --fail "https://www.figma.com/api/mcp/asset/dc561f06-46e4-4356-a3e2-9beec13279d5.png" -o (Join-Path $imageDir "hien-dai-product-11.png")
if ($LASTEXITCODE -ne 0) { throw "Download failed." }

Write-Host "Downloading hien-dai-product-12.png..."
curl.exe -L --fail "https://www.figma.com/api/mcp/asset/ef240263-958c-4f6c-be57-e18dec064ec2.png" -o (Join-Path $imageDir "hien-dai-product-12.png")
if ($LASTEXITCODE -ne 0) { throw "Download failed." }

Write-Host "DONE - 12 Hien Dai product images saved to public/images" -ForegroundColor Green