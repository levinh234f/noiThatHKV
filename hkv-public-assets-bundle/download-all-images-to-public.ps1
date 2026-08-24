$ErrorActionPreference = "Stop"

$imageDir = Join-Path (Get-Location) "public\images"
New-Item -ItemType Directory -Force -Path $imageDir | Out-Null

$assets = @(
  @{
    Name = "products-hero.png"
    Url  = "https://www.figma.com/api/mcp/asset/7bd44583-11cf-4a0a-ac45-8107edb2f3a5.png"
  },
  @{
    Name = "products-search.svg"
    Url  = "https://www.figma.com/api/mcp/asset/6b090ce2-7714-4738-a573-e8164804354c.svg"
  },
  @{
    Name = "products-expand-arrow.png"
    Url  = "https://www.figma.com/api/mcp/asset/32088051-ab60-463c-a83c-bb9429b1f348.png"
  },
  @{
    Name = "products-plus.png"
    Url  = "https://www.figma.com/api/mcp/asset/8f4d55cf-ac60-4775-805f-7663c1e2dd96.png"
  },
  @{
    Name = "products-heart.png"
    Url  = "https://www.figma.com/api/mcp/asset/94976801-d5dc-426f-8b3c-0afc2c7f0c27.png"
  },
  @{
    Name = "products-page-back.png"
    Url  = "https://www.figma.com/api/mcp/asset/7d008bfa-3834-4f09-aa5e-546190b76aab.png"
  },
  @{
    Name = "products-page-forward.png"
    Url  = "https://www.figma.com/api/mcp/asset/8798c235-07ac-4520-aa8a-d1d09f4404ab.png"
  },
  @{
    Name = "category-sofa.png"
    Url  = "https://www.figma.com/api/mcp/asset/95de5492-c2c9-4869-a40e-e70400093adc.png"
  },
  @{
    Name = "category-chair.png"
    Url  = "https://www.figma.com/api/mcp/asset/9909b99e-257c-45b1-b87d-9e7407d31ca2.png"
  },
  @{
    Name = "category-bed.png"
    Url  = "https://www.figma.com/api/mcp/asset/bafb7759-74f0-4563-b16a-c1021bb20129.png"
  },
  @{
    Name = "category-table.png"
    Url  = "https://www.figma.com/api/mcp/asset/fcd468c7-ee56-4839-8b6a-5c035489add8.png"
  },
  @{
    Name = "category-cabinet.png"
    Url  = "https://www.figma.com/api/mcp/asset/3a37d659-abcc-43ac-8782-60ef15d7f06b.png"
  },
  @{
    Name = "category-lamp.png"
    Url  = "https://www.figma.com/api/mcp/asset/9fad4fa8-48b0-4f44-94d4-2a42c9277d0f.png"
  },
  @{
    Name = "category-rug.png"
    Url  = "https://www.figma.com/api/mcp/asset/c344527e-0432-4d07-a000-a0600689f8b9.png"
  },
  @{
    Name = "category-decor.png"
    Url  = "https://www.figma.com/api/mcp/asset/83285b43-bb33-46de-84a9-9e6c96f39106.png"
  },
  @{
    Name = "style-modern.png"
    Url  = "https://www.figma.com/api/mcp/asset/24776d25-91e6-4429-ada8-1038e1733231.png"
  },
  @{
    Name = "style-indochine.png"
    Url  = "https://www.figma.com/api/mcp/asset/158c8dd1-746d-465b-80d1-7560b95c349a.png"
  },
  @{
    Name = "style-neoclassical.png"
    Url  = "https://www.figma.com/api/mcp/asset/04f0a53c-46d6-4425-975f-66d6fbca12b7.png"
  },
  @{
    Name = "product-sofa-elara.png"
    Url  = "https://www.figma.com/api/mcp/asset/f2d2ae63-28dc-4967-9e21-078c688ca153.png"
  },
  @{
    Name = "product-chair-dong-duong.png"
    Url  = "https://www.figma.com/api/mcp/asset/fac23309-d03a-4232-8186-04120f9ba54f.png"
  },
  @{
    Name = "product-table-luna.png"
    Url  = "https://www.figma.com/api/mcp/asset/4beec32d-1be3-41ee-8453-4a6146460da0.png"
  },
  @{
    Name = "product-bed-victoria.png"
    Url  = "https://www.figma.com/api/mcp/asset/054afe34-05a5-4f59-b7b8-c7c390221a4f.png"
  },
  @{
    Name = "article-tan-co-dien-hero.png"
    Url  = "https://www.figma.com/api/mcp/asset/d93ee05c-51db-488f-bbae-d11fe7ea3506.png"
  },
  @{
    Name = "article-tan-co-dien-living-room.png"
    Url  = "https://www.figma.com/api/mcp/asset/846815ef-1d61-4b10-b22b-b9c0ac092690.png"
  },
  @{
    Name = "article-tan-co-dien-bedroom.png"
    Url  = "https://www.figma.com/api/mcp/asset/4e0d2e04-217a-4c18-a642-2f49c6291de3.png"
  },
  @{
    Name = "article-tan-co-dien-kitchen.png"
    Url  = "https://www.figma.com/api/mcp/asset/a850313c-8c38-45b2-a053-2779a27def5f.png"
  },
  @{
    Name = "article-tan-co-dien-bathroom.png"
    Url  = "https://www.figma.com/api/mcp/asset/5a2b2be1-0413-4b8b-a41a-2904ead8b706.png"
  },
)

foreach ($asset in $assets) {
  $output = Join-Path $imageDir $asset.Name
  Write-Host "Downloading $($asset.Name)..."
  Invoke-WebRequest -Uri $asset.Url -OutFile $output
}

Write-Host ""
Write-Host "DONE - All Figma images are now inside public/images" -ForegroundColor Green
Write-Host "From now on the website uses /images/... and no longer depends on Figma links." -ForegroundColor Green