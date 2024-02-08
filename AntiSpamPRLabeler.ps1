# Assuming repoOwner, repoName, and GITHUB_TOKEN are set as environment variables or action inputs
$repoOwner = $env:GITHUB_REPOSITORY_OWNER
$repoName = $env:REPOSITORY_NAME
$GITHUB_TOKEN = $env:GITHUB_TOKEN
$maxChangesForLabel = $env:MAX_CHANGES_FOR_LABEL
$labelMessage = $env:LABEL_MESSAGE
$authHeader = "Bearer $GITHUB_TOKEN"
$currentPRNumber = $env:PR_NUMBER

function Add-LabelToPullRequest {
    param (
        [int]$prNumber,
        [string]$label
    )
    $labelUri = "https://api.github.com/repos/$repoOwner/$repoName/issues/$prNumber/labels"
    $body = @{
        labels = @($label)
    } | ConvertTo-Json

    Invoke-RestMethod -Uri $labelUri -Method POST -Headers @{
        Authorization = $authHeader
        Accept        = "application/vnd.github.v3+json"
    } -Body $body -ContentType "application/json"
}

function Add-CommentToPullRequest {
    param (
        [int]$prNumber,
        [string]$comment
    )
    $commentUri = "https://api.github.com/repos/$repoOwner/$repoName/issues/$prNumber/comments"
    $body = @{
        body = $comment
    } | ConvertTo-Json

    Invoke-RestMethod -Uri $commentUri -Method POST -Headers @{
        Authorization = $authHeader
        Accept        = "application/vnd.github.v3+json"
    } -Body $body -ContentType "application/json"
}

Write-Host "repoOwner: $repoOwner"
Write-Host "repoName: $repoName"
Write-Host "Current PR Number: $currentPRNumber"
Write-Host "maxChangesForLabel: $maxChangesForLabel"
Write-Host "labelMessage: $labelMessage"

$uri = "https://api.github.com/$repoOwner/$repoName/pull/$currentPRNumber"
$response = Invoke-RestMethod -Uri $uri -Method Get -Headers @{
    Authorization = $authHeader
    Accept        = "application/vnd.github.v3+json"
}
$currentPR = $response

$additions = $currentPR.additions
$deletions = $currentPR.deletions
$totalChanges = $additions + $deletions

Write-Host "PRVariable: $pr"

Write-Host "authHeader: $authHeader"
Write-Host "additions: $additions"
Write-Host "deletions: $deletions"
Write-Host "totalChanges: $totalChanges"


if ($totalChanges -le $maxChangesForLabel) {
    Add-LabelToPullRequest -prNumber $currentPRNumber -label "Potential Spam"
    Add-CommentToPullRequest -prNumber $currentPRNumber -comment $labelMessage
}
