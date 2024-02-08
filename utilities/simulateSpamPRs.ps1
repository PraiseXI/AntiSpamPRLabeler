# Configuration parameters (change as necessary)
$accessToken = $env:ACCESS_TOKEN
$username = $env:USERNAME
$repo = $env:REPO
$mainBranch = $env:MAIN_BRANCH

# Headers for authorization and accepting the JSON response
$headers = @{
    Authorization = "token $accessToken"
    Accept = 'application/vnd.github.v3+json'
}

# Function to create a random file content
function New-RandomContent {
    -join ((65..90) + (97..122) | Get-Random -Count 256 | ForEach-Object { [char]$_ })
}

# Function to create slightly varied content for realistic PRs, ensuring ~5 lines are changed
function New-VariedContent {
    param (
        [int]$variation
    )
    $baseLines = @(
        "This is the base line of the file.",
        "Each of these lines represents a placeholder for content.",
        "Modifications will occur below to simulate realistic changes.",
        "Line four remains constant across variations.",
        "Final base line before variations are applied."
    )

    $modifiedLines = $baseLines.Clone()
    # Modify ~5 lines slightly
    for ($i = 0; $i -lt 5; $i++) {
        $index = (Get-Random -Minimum 0 -Maximum $baseLines.Count)
        $modifiedLines[$index] = "$($baseLines[$index]) Variation: $variation Change: $i"
    }

    return $modifiedLines -join "`n"
}

# Function to create a branch on GitHub
function New-Branch {
    param (
        [string]$newBranchName,
        [string]$sourceBranchName
    )
    $getSourceBranchUrl = "https://api.github.com/repos/$username/$repo/git/refs/heads/$sourceBranchName"
    $sourceBranch = Invoke-RestMethod -Uri $getSourceBranchUrl -Method Get -Headers $headers
    $shaLatestCommit = $sourceBranch.object.sha

    $createBranchUrl = "https://api.github.com/repos/$username/$repo/git/refs"
    $data = @{
        ref = "refs/heads/$newBranchName"
        sha = $shaLatestCommit
    }
    $response = Invoke-RestMethod -Uri $createBranchUrl -Method Post -Headers $headers -Body ($data | ConvertTo-Json)
    return $response
}

# Function to New a file on GitHub
function New-File {
    param (
        [string]$filename,
        [string]$content,
        [string]$branch
    )
    $url = "https://api.github.com/repos/$username/$repo/contents/$filename"
    $data = @{
        message = "Add $filename"
        content = [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes($content))
        branch = $branch
    }
    $response = Invoke-RestMethod -Uri $url -Method Put -Headers $headers -Body ($data | ConvertTo-Json)
    return $response
}

# Function to New a pull request
function New-PullRequest {
    param (
        [string]$title,
        [string]$body,
        [string]$head,
        [string]$base
    )
    $url = "https://api.github.com/repos/$username/$repo/pulls"
    $data = @{
        title = $title
        body = $body
        head = $head
        base = $base
    }
    $response = Invoke-RestMethod -Uri $url -Method Post -Headers $headers -Body ($data | ConvertTo-Json)
    return $response
}

# Generate a random starting number (example range: 1 to 10 for demonstration)
$startNumber = Get-Random -Minimum 1 -Maximum 11

# Main logic to alternate between realistic and spammy PRs
$startNumber..($startNumber + 10) | ForEach-Object {
    $variation = $_ % 5 # Use modulo to create a cycle of variations
    $isSpam = $_ % 2 -eq 0 # Even numbers are spam, odd numbers are realistic PRs
    $newBranchName = if ($isSpam) { "spam-branch-$_" } else { "realistic-branch-$_" }
    $filename = if ($isSpam) { "spam_$_.txt" } else { "realistic_change_$_`s_file.txt" }
    $content = if ($isSpam) { New-RandomContent } else { New-VariedContent -variation $variation }

    # Create a new branch for each PR
    New-Branch -newBranchName $newBranchName -sourceBranchName $mainBranch

    # Create a new file in the new branch
    New-File -filename $filename -content $content -branch $newBranchName

    $prTitle = if ($isSpam) { "Spam PR #$_" } else { "Realistic PR #$_ with approximately 5 line changes" }
    $prBody = if ($isSpam) { "This is a spam PR, please ignore." } else { "This PR introduces minor but specific realistic changes, altering approximately 5 lines for testing purposes." }

    # Create a new PR from the new branch to the main branch
    New-PullRequest -title $prTitle -body $prBody -head $newBranchName -base $mainBranch
}
