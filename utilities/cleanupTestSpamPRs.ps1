# CLEANUP

# Configuration parameters
$accessToken = ""
$username = ""
$repo = ""

# Headers for authorization and accepting the JSON response
$headers = @{
    Authorization = "token $accessToken"
    Accept = 'application/vnd.github.v3+json'
}

# Function to delete a branch on GitHub
function Remove-Branch {
    param (
        [string]$branchName
    )
    $deleteBranchUrl = "https://api.github.com/repos/$username/$repo/git/refs/heads/$branchName"
    Invoke-RestMethod -Uri $deleteBranchUrl -Method Delete -Headers $headers
    Write-Host "Deleted branch: $branchName"
}

# Get all branches from the repo
$branchesUrl = "https://api.github.com/repos/$username/$repo/branches"
$branches = Invoke-RestMethod -Uri $branchesUrl -Method Get -Headers $headers

# Loop through each branch and delete if it matches the spam or realistic branch naming pattern
foreach ($branch in $branches) {
    if ($branch.name -like "spam-branch-*" -or $branch.name -like "realistic-branch-*") {
        Remove-Branch -branchName $branch.name
    }
}
