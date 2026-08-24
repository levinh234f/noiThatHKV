$ErrorActionPreference = "Stop"

$imageDir = Join-Path (Get-Location) "public\images"
New-Item -ItemType Directory -Force -Path $imageDir | Out-Null

$assets = @(
  @{
    Name = "article-hien-dai-hero.png"
    Url  = "https://www.figma.com/api/mcp/asset/fcc2db07-7d6a-407b-9e91-8c0e388062c0.png"
  },
  @{
    Name = "article-hien-dai-living-room.png"
    Url  = "https://www.figma.com/api/mcp/asset/0c7c132a-3add-4cb3-8f0a-d3022255c5c3.png"
  },
  @{
    Name = "article-hien-dai-bedroom.png"
    Url  = "https://www.figma.com/api/mcp/asset/59f62e15-f578-4dd6-9b59-8d985b5cfa6b.png"
  },
  @{
    Name = "article-hien-dai-dining-room.png"
    Url  = "https://www.figma.com/api/mcp/asset/118aab5f-ef43-4601-a910-11fe13089016.png"
  },
  @{
    Name = "article-hien-dai-kitchen.png"
    Url  = "https://www.figma.com/api/mcp/asset/41bfa28d-6dc5-49b6-bffa-4d9e99710b28.png"
  },
  @{
    Name = "article-hien-dai-bathroom.png"
    Url  = "https://www.figma.com/api/mcp/asset/67b876f7-b796-4e1a-b84e-745cd3f4352a.png"
  }
)

foreach ($asset in $assets) {
  $output = Join-Path $imageDir $asset.Name
  Write-Host "Downloading $($asset.Name)..."
  Invoke-WebRequest -Uri $asset.Url -OutFile $output
}

Write-Host ""
Write-Host "DONE - Modern article images saved to public/images" -ForegroundColor Green
