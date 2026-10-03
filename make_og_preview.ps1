Add-Type -AssemblyName System.Drawing

$srcPath = Join-Path $PSScriptRoot "image.png"
$outPath = Join-Path $PSScriptRoot "og-preview.jpg"

$targetWidth = 1200
$targetHeight = 630

$bmp = New-Object System.Drawing.Bitmap $targetWidth, $targetHeight
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit

# Deep Luxury Midnight Navy Background
$navyBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.ColorTranslator]::FromHtml("#070b14"))
$g.FillRectangle($navyBrush, 0, 0, $targetWidth, $targetHeight)
$navyBrush.Dispose()

# Draw Double Outer Gold Frame
$goldOuterPen = New-Object System.Drawing.Pen ([System.Drawing.ColorTranslator]::FromHtml("#d4af37")), 3
$g.DrawRectangle($goldOuterPen, 20, 20, $targetWidth - 40, $targetHeight - 40)
$goldOuterPen.Dispose()

$goldInnerPen = New-Object System.Drawing.Pen ([System.Drawing.ColorTranslator]::FromHtml("#6b541e")), 1
$g.DrawRectangle($goldInnerPen, 28, 28, $targetWidth - 56, $targetHeight - 56)
$goldInnerPen.Dispose()

# Draw Corner Ornaments (Classic L-brackets)
$cornerPen = New-Object System.Drawing.Pen ([System.Drawing.ColorTranslator]::FromHtml("#f5d77f")), 2
# Top-Left
$g.DrawLine($cornerPen, 35, 35, 65, 35)
$g.DrawLine($cornerPen, 35, 35, 35, 65)
# Top-Right
$g.DrawLine($cornerPen, $targetWidth - 65, 35, $targetWidth - 35, 35)
$g.DrawLine($cornerPen, $targetWidth - 35, 35, $targetWidth - 35, 65)
# Bottom-Left
$g.DrawLine($cornerPen, 35, $targetHeight - 65, 35, $targetHeight - 35)
$g.DrawLine($cornerPen, 35, $targetHeight - 35, 65, $targetHeight - 35)
# Bottom-Right
$g.DrawLine($cornerPen, $targetWidth - 65, $targetHeight - 35, $targetWidth - 35, $targetHeight - 35)
$g.DrawLine($cornerPen, $targetWidth - 35, $targetHeight - 65, $targetWidth - 35, $targetHeight - 35)
$cornerPen.Dispose()

# Left Emblem Frame: An elegant ivory card
$cardX = 60
$cardY = 55
$cardW = 380
$cardH = 515

$cardBg = New-Object System.Drawing.SolidBrush ([System.Drawing.ColorTranslator]::FromHtml("#fdfbf7"))
$g.FillRectangle($cardBg, $cardX, $cardY, $cardW, $cardH)
$cardBg.Dispose()

$cardBorder = New-Object System.Drawing.Pen ([System.Drawing.ColorTranslator]::FromHtml("#d4af37")), 3
$g.DrawRectangle($cardBorder, $cardX, $cardY, $cardW, $cardH)
$cardBorder.Dispose()

$cardBorderInner = New-Object System.Drawing.Pen ([System.Drawing.ColorTranslator]::FromHtml("#c59b27")), 1
$g.DrawRectangle($cardBorderInner, $cardX + 6, $cardY + 6, $cardW - 12, $cardH - 12)
$cardBorderInner.Dispose()

# Draw Logo Image with clean safe margins inside Card
$logo = [System.Drawing.Image]::FromFile($srcPath)
$padH = 24
$padW = 18
$availW = $cardW - ($padW * 2)
$availH = $cardH - ($padH * 2)
$scale = [Math]::Min($availW / $logo.Width, $availH / $logo.Height)
$drawW = [int]($logo.Width * $scale)
$drawH = [int]($logo.Height * $scale)
$drawX = $cardX + [int](($cardW - $drawW) / 2)
$drawY = $cardY + [int](($cardH - $drawH) / 2)

$g.DrawImage($logo, $drawX, $drawY, $drawW, $drawH)
$logo.Dispose()

# Right Content Area
$textX = 485

# Fonts
$fontBrand = [System.Drawing.Font]::new("Georgia", [float]44, [System.Drawing.FontStyle]::Bold)
$fontSub = [System.Drawing.Font]::new("Georgia", [float]24, [System.Drawing.FontStyle]::Regular)
$fontTagline = [System.Drawing.Font]::new("Arial", [float]20, [System.Drawing.FontStyle]::Bold)
$fontList = [System.Drawing.Font]::new("Arial", [float]17, [System.Drawing.FontStyle]::Regular)
$fontPill = [System.Drawing.Font]::new("Arial", [float]12, [System.Drawing.FontStyle]::Bold)
$fontDomain = [System.Drawing.Font]::new("Arial", [float]15, [System.Drawing.FontStyle]::Bold)

# Brushes
$goldBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.ColorTranslator]::FromHtml("#e8c360"))
$whiteBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.ColorTranslator]::FromHtml("#ffffff"))
$mutedBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.ColorTranslator]::FromHtml("#d1d5db"))
$goldLightBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.ColorTranslator]::FromHtml("#f5df99"))
$badgeBg = New-Object System.Drawing.SolidBrush ([System.Drawing.ColorTranslator]::FromHtml("#161f30"))
$badgeBorder = New-Object System.Drawing.Pen ([System.Drawing.ColorTranslator]::FromHtml("#d4af37")), 1

# Category Pill Badge
$g.FillRectangle($badgeBg, $textX, 60, 270, 32)
$g.DrawRectangle($badgeBorder, $textX, 60, 270, 32)
$g.DrawString("VEDIC & NADI ASTROLOGY", $fontPill, $goldLightBrush, $textX + 22, 68)

# Brand Title
$g.DrawString("Shri Gurudatta", $fontBrand, $whiteBrush, $textX, 105)
$g.DrawString("A S T R O V E D", $fontSub, $goldBrush, $textX + 4, 168)

# Golden Decorative Divider
$dividerPen = New-Object System.Drawing.Pen ([System.Drawing.ColorTranslator]::FromHtml("#d4af37")), 2
$g.DrawLine($dividerPen, $textX, 218, $targetWidth - 75, 218)
$dividerPen.Dispose()

# Experience / Location
$g.DrawString("Ancient Wisdom | Clearer Guidance", $fontTagline, $goldLightBrush, $textX, 238)
$g.DrawString("15+ Years of Traditional Practice  |  Palnadu, Andhra Pradesh", $fontList, $mutedBrush, $textX, 276)

# Service Bullet Points with custom drawn Gold Diamonds
$bulletY = 328
$spacing = 38
$services = @(
    "Birth Chart & Horoscope Analysis",
    "Marriage Compatibility & Porutham Matching",
    "Auspicious Muhurtham & Vastu Guidance",
    "Energized Remedies, Yantras & Sacred Malas"
)

$diamondBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.ColorTranslator]::FromHtml("#e8c360"))
for ($i = 0; $i -lt $services.Count; $i++) {
    $curY = $bulletY + ($i * $spacing)
    # Draw a 10x10 rotated diamond
    $midX = $textX + 7
    $midY = $curY + 11
    $points = @(
        (New-Object System.Drawing.Point ($midX, ($midY - 6))),
        (New-Object System.Drawing.Point (($midX + 6), $midY)),
        (New-Object System.Drawing.Point ($midX, ($midY + 6))),
        (New-Object System.Drawing.Point (($midX - 6), $midY))
    )
    $g.FillPolygon($diamondBrush, $points)
    $g.DrawString($services[$i], $fontList, $whiteBrush, $textX + 26, $curY)
}
$diamondBrush.Dispose()

# Footer Badge with Website Domain
$footerBoxW = 490
$footerBoxH = 42
$footerY = 512
$g.FillRectangle($badgeBg, $textX, $footerY, $footerBoxW, $footerBoxH)
$g.DrawRectangle($badgeBorder, $textX, $footerY, $footerBoxW, $footerBoxH)
$g.DrawString("VISIT ONLINE: sri-guru-astro.vercel.app", $fontDomain, $goldBrush, $textX + 22, $footerY + 11)

# Cleanup GDI Brushes & Pens
$badgeBg.Dispose()
$badgeBorder.Dispose()
$goldBrush.Dispose()
$whiteBrush.Dispose()
$mutedBrush.Dispose()
$goldLightBrush.Dispose()

# Save as high quality optimized JPEG
$codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.FormatDescription -eq "JPEG" }
$encoderParams = New-Object System.Drawing.Imaging.EncoderParameters 1
$encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality, [long]90)

$bmp.Save($outPath, $codec, $encoderParams)

$g.Dispose()
$bmp.Dispose()

# Also generate 600x600 square preview
$sqPath = Join-Path $PSScriptRoot "og-preview-square.jpg"
$sqBmp = New-Object System.Drawing.Bitmap 600, 600
$sqG = [System.Drawing.Graphics]::FromImage($sqBmp)
$sqG.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$sqG.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$sqG.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$sqG.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit

$sqNavy = New-Object System.Drawing.SolidBrush ([System.Drawing.ColorTranslator]::FromHtml("#070b14"))
$sqG.FillRectangle($sqNavy, 0, 0, 600, 600)
$sqNavy.Dispose()

# Outer gold border
$sqPen = New-Object System.Drawing.Pen ([System.Drawing.ColorTranslator]::FromHtml("#d4af37")), 3
$sqG.DrawRectangle($sqPen, 15, 15, 570, 570)
$sqPen.Dispose()

# Inner logo card
$sqCardBg = New-Object System.Drawing.SolidBrush ([System.Drawing.ColorTranslator]::FromHtml("#fdfbf7"))
$sqG.FillRectangle($sqCardBg, 40, 40, 520, 420)
$sqCardBg.Dispose()

$sqCardBorder = New-Object System.Drawing.Pen ([System.Drawing.ColorTranslator]::FromHtml("#d4af37")), 2
$sqG.DrawRectangle($sqCardBorder, 40, 40, 520, 420)
$sqCardBorder.Dispose()

$sqLogo = [System.Drawing.Image]::FromFile($srcPath)
$sqScale = [Math]::Min(480 / $sqLogo.Width, 380 / $sqLogo.Height)
$sqDW = [int]($sqLogo.Width * $sqScale)
$sqDH = [int]($sqLogo.Height * $sqScale)
$sqDX = 40 + [int]((520 - $sqDW) / 2)
$sqDY = 40 + [int]((420 - $sqDH) / 2)
$sqG.DrawImage($sqLogo, $sqDX, $sqDY, $sqDW, $sqDH)
$sqLogo.Dispose()

# Bottom text
$sqFontTitle = [System.Drawing.Font]::new("Georgia", [float]24, [System.Drawing.FontStyle]::Bold)
$sqFontSub = [System.Drawing.Font]::new("Arial", [float]13, [System.Drawing.FontStyle]::Regular)
$sqGold = New-Object System.Drawing.SolidBrush ([System.Drawing.ColorTranslator]::FromHtml("#e8c360"))
$sqMuted = New-Object System.Drawing.SolidBrush ([System.Drawing.ColorTranslator]::FromHtml("#d1d5db"))

$sf = New-Object System.Drawing.StringFormat
$sf.Alignment = [System.Drawing.StringAlignment]::Center
$sqG.DrawString("Shri Gurudatta Astroved", $sqFontTitle, $sqGold, 300, 480, $sf)
$sqG.DrawString("Vedic & Nadi Astrology | 15+ Yrs Experience", $sqFontSub, $sqMuted, 300, 525, $sf)
$sf.Dispose()
$sqGold.Dispose()
$sqMuted.Dispose()

$sqBmp.Save($sqPath, $codec, $encoderParams)
$sqG.Dispose()
$sqBmp.Dispose()

$sqFi = Get-Item $sqPath
Write-Host "Generated $sqPath size: $($sqFi.Length) bytes"

