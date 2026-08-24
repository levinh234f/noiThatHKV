$ErrorActionPreference = "Stop"

$imageDir = Join-Path (Get-Location) "public\images"
New-Item -ItemType Directory -Force -Path $imageDir | Out-Null

$assets = @(
  @{
    Name = "article-dong-duong-hero.png"
    Url = "https://www.figma.com/api/mcp/asset/7032d5b8-4d9d-4afc-894c-ab2840f41742.png"
  },
  @{
    Name = "article-dong-duong-living-room.png"
    Url = "https://www.figma.com/api/mcp/asset/fa9f4924-85be-44f1-b08b-b0b8e01a9c38.png"
  },
  @{
    Name = "article-dong-duong-bedroom.png"
    Url = "https://www.figma.com/api/mcp/asset/e20c2003-f3a4-4160-8d27-3a0f43559a8e.png"
  },
  @{
    Name = "article-dong-duong-dining-room.png"
    Url = "https://www.figma.com/api/mcp/asset/a2b2610f-b71a-4eb9-976b-c7640102a746.png"
  },
  @{
    Name = "article-dong-duong-work-desk.png"
    Url = "https://www.figma.com/api/mcp/asset/d07c5fed-215a-4eca-bf29-bbde145a1461.png"
  },
  @{
    Name = "article-dong-duong-bathroom.png"
    Url = "https://www.figma.com/api/mcp/asset/ae16615c-fa2b-4df8-96c0-372a9b7a1ca0.png"
  }
)

$failed = @()
foreach ($asset in $assets) {
  $output = Join-Path $imageDir $asset.Name
  $ok = $false
  for ($attempt = 1; $attempt -le 3; $attempt++) {
    try {
      Write-Host "Downloading $($asset.Name) - attempt $attempt..."
      Invoke-WebRequest -Uri $asset.Url -OutFile $output
      $ok = $true
      break
    } catch {
      if ($attempt -lt 3) { Start-Sleep -Seconds 1 }
    }
  }
  if (-not $ok) { $failed += $asset.Name }
}
if ($failed.Count -eq 0) {
  Write-Host "DONE - 6 Dong Duong images saved to public/images" -ForegroundColor Green
} else {
  Write-Host "FAILED: $($failed -join ", ")" -ForegroundColor Red
  exit 1
}