$ErrorActionPreference = 'Stop'
$projectRoot = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$bundleRoot = Join-Path $projectRoot 'HOSTINGER'
$siteSource = Join-Path $projectRoot 'public'
$siteTarget = Join-Path $bundleRoot 'public_html'
$zipTarget = Join-Path $bundleRoot 'charlie-public_html.zip'

if ([IO.Path]::GetFullPath($siteTarget) -ne (Join-Path $projectRoot 'HOSTINGER\public_html')) { throw 'Destino de paquete no válido' }
if (-not (Test-Path -LiteralPath (Join-Path $siteSource 'index.html'))) { throw 'Primero ejecute npm run build' }
New-Item -ItemType Directory -Path $bundleRoot -Force | Out-Null
if (Test-Path -LiteralPath $siteTarget) { Remove-Item -LiteralPath $siteTarget -Recurse -Force }
Copy-Item -LiteralPath $siteSource -Destination $siteTarget -Recurse
if (Test-Path -LiteralPath $zipTarget) { Remove-Item -LiteralPath $zipTarget -Force }
Add-Type -AssemblyName System.IO.Compression.FileSystem
Add-Type -AssemblyName System.IO.Compression
$archive = [IO.Compression.ZipFile]::Open($zipTarget, [IO.Compression.ZipArchiveMode]::Create)
try {
  foreach ($file in Get-ChildItem -LiteralPath $siteTarget -File -Recurse -Force) {
    $relativePath = $file.FullName.Substring($siteTarget.Length + 1).Replace('\', '/')
    [IO.Compression.ZipFileExtensions]::CreateEntryFromFile($archive, $file.FullName, $relativePath, [IO.Compression.CompressionLevel]::Optimal) | Out-Null
  }
} finally { $archive.Dispose() }
Copy-Item -LiteralPath (Join-Path $projectRoot 'docs\hostinger.md') -Destination (Join-Path $bundleRoot 'LEEME.md') -Force
Write-Host "Carpeta para subir: $siteTarget"
Write-Host "ZIP para extraer dentro de public_html: $zipTarget"
